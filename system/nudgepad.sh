#!/bin/bash
# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
systemPath="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
cd $systemPath
source paths.sh
source isMac.sh
source fixPermissions.sh
source createFolders.sh

# Set default ports and then load $tempPath/settings.sh to override those
source config.sh
if [ -f $tempPath/config.sh ]
  then
    source $tempPath/config.sh
  else
    cp $systemPath/config.sh $tempPath/config.sh
fi

# get all projects 1 per line filter out hidden dirs
projects="$(ls $projectsPath)"

# get all projects 1 per line filter out hidden dirs
runningProjects="$(ls $runningPath)"
runningPorts="$(ls $portsPath)"

# Include our BASH functions
source speedcoach.sh
source fixPermissions.sh
source isProject.sh
source isActive.sh
source isProxyUp.sh
source startProject.sh
source stopProject.sh
source stopProxy.sh
source startProxy.sh
source startPanel.sh
source stopPanel.sh
source isChanged.sh
source commit.sh
source deleteProject.sh
source waitUntilServing.sh
source createOwnerFile.sh
source createProject.sh
source macUser.sh

case "$1" in

'backup')
  source cron/backup.sh
;;

# Mac only. Open a project in browser
'browse')
  open http://$2.localhost/
;;

'clear')
  for d in $runningProjects
  do
    sudo rm -f $runningPath/$d
  done
  for d in $runningPorts
  do
    sudo rm -f $portsPath/$d
  done
;;

'commit')
  commit $2
;;

'commitAll')
  for domain in $projects
  do
    commit $domain
  done
;;

'copy')
  sourceDomain=$2
  destinationDomain=$3
  sudo cp -R $projectsPath/$sourceDomain $projectsPath/$destinationDomain
  if isNix
    then
      sudo $systemPath/createUser.sh $destinationDomain $USER
  fi
  # if on localhost, append to the hosts file to add the domain
  if isMac
    then
      echo "127.0.0.1 $destinationDomain" | sudo tee -a /etc/hosts >/dev/null
  fi
  startProject $destinationDomain
;;

'create')
  speedcoach "start of create"
  if createProject $2 $3 $4 $5
    then
      speedcoach "before start project"
      if startProject $2
        then
          speedcoach "wait until serving"
          # Get owner link
          # this takes about 400ms. 
          waitUntilServing $2
          echo $OWNERLINK
          # exit 0
          speedcoach "link sent"
          speedcoach_total
      else
        echo Failed starting $2
        exit 1
      fi
    else
      echo Failed to create $2
      exit 1
  fi
;;

'delete')
  deleteProject $2
;;

'deleteAll')
  for D in $projects
  do
    deleteProject $D
  done
;;

'fixPermissions')
  fixPermissions
;;

'host')
  sudo python $systemPath/hosts.py $2
;;

'isChanged')
  if isChanged $2
    then
      echo $2 is changed
    else
      echo $2 is NOT changed
  fi
;;

'isProject')
  isProject $2
;;

'isActive')
  if isActive $2
    then
      echo $2 is up
    else
      echo $2 is down
  fi
;;

'kill')
  # todo: kill all running mon instances and node instances
  rm -f /nudgepad/ports/*
  rm -rf /nudgepad/running/*
;;

# Tool for SysAdmins to get link for someone who hasn't registered project
'link')
  node getOwnerLink.js $2
;;

'log')
  if [ -n "$2" ]
    then
      sudo cat $projectsPath/$2/private/app.log.txt
    else
      # Proxy log
      sudo cat $logsPath/proxy.txt
  fi
;;

'logs')
  sudo cat $projectsPath/$2/private/app.log.txt
;;

# Mac only. Open a project in textmate
'mate')
  mate $projectsPath/$2/
;;

# Mac only. Open a project in finder
'open')
  open $projectsPath/$2/
;;

'permit')
  # i hate you file permissions
  if isMac
    then
      sudo chmod -R 777 $projectsPath
  fi
;;

'pids')
  # display all NudgePad related pids
  echo Panel PID
  cat $tempPath/panelPid
  echo 
  echo Panel Mon PID
  cat $tempPath/panelMonPid
  echo 
  echo Proxy PID
  cat $tempPath/proxyPid
  echo 
  echo Proxy Mon PID
  cat $tempPath/proxyMonPid
  echo 
  for domain in $runningProjects
  do
    echo $domain PID
    cat $projectsPath/$domain/private/projectPid.txt
    echo 
    echo $domain Mon PID
    cat $projectsPath/$domain/private/monPid.txt
    echo 
  done
;;

'projects')
  for domain in $projects
  do
    echo $domain
  done
;;

'restart')
  if [ -z $2 ]
    then    
      stopProxy
      stopPanel
      startPanel
      startProxy
      exit 0
  fi
  stopProject $2
  startProject $2
;;

'restartAll')
  for domain in $runningProjects
  do
    stopProject $domain
    startProject $domain
  done
;;

'running')
  echo $runningProjects
;;

'r')
  echo $macUser
;;

'start')
  if [ -z $2 ]
    then
      startProxy
      startPanel
      exit 2
  fi
  if startProject $2
    then
      exit 0
    else
      exit 1
  fi
;;

'stop')
  if [ -n "$2" ]
    then
      stopProject $2
    else
      stopProxy
      stopPanel
      for domain in $runningProjects
      do
        stopProject $domain
      done
  fi
;;

# Mac only. Open a project in sublime
'sub')
  /Applications/Sublime\ Text\ 2.app/Contents/SharedSupport/bin/subl $projectsPath/$2/
;;

'tail')
  if [ -n "$2" ]
    then
      sudo tail -n 30 -f $projectsPath/$2/private/app.log.txt
    else
      # Proxy log
      sudo tail -n 30 -f $logsPath/proxy.txt
  fi
;;

'tailPanel')
  sudo tail -n 30 -f $logsPath/panelMon.txt
;;

'traffic')
  if [ -n "$2" ]
    then
      sudo tail -n 30 -f $projectsPath/$2/private/requests.log.txt
    else
      # Proxy log
      echo No domain provided
  fi
;;

'uninstall')
  # http://stackoverflow.com/questions/1885525/how-do-i-prompt-a-user-for-confirmation-in-bash-script
  read -p "This will delete all user data. Are you sure? " -n 1 -r
  if [[ $REPLY =~ ^[Yy]$ ]]
    then
      # do dangerous stuff
      sudo rm -rf /nudgepad/
      npm uninstall nudgepad
      rm -rf ~/nudgepad/
  fi
;;

'watch')
  while [ 1 ]
  do
    echo "***Watching $domain.***"
    echo "Type the domain you want to watch, followed by enter:"
    read input
    if [ -n "$input" ]
      then
        domain=$input
    fi
    cat $projectsPath/$domain/private/app.log.txt
  done
;;

'zip')
  cd $projectsPath
  zip -r ~/projects.zip .
;;

*)


echo "*** Nudgepad Commands ***"
echo "nudgepad start - Start proxy and panel"
echo "nudgepad create domain email@domain.com template.space - Creates a new project"
echo "nudgepad stop - Stop all"
;;
esac


