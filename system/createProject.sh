createFromTemplate ()
{
  domain=$1
  template=$2
  if [[ "$template" == *.space ]]
    then
      echo Creating from space file 1>&2
      space $template $projectsPath/$domain
    else
      echo Creating from dir 1>&2
      cp -R $template $projectsPath/$domain
  fi
}

createProject ()
{
  domain=$1
  ownerEmail=$2
  template=$3
  if [ -z $domain ]
    then
      echo ERROR. No domain entered. Your project needs a name. Usage: create domain owner@owner.com template.space
      return 1
  fi
  if [ -z $ownerEmail ]
    then
      echo ERROR. No email entered. Your project needs an owner. Usage: create domain owner@owner.com template.space
      return 1
  fi
  if isProject $domain
    then
      echo $domain already exists
      return 1
  fi
  
  if [ -n "$template" ]
    then
      createFromTemplate $domain $template
    else
      # echo NO source provided. Creating blank project from blank.
      cp -R blank $projectsPath/$domain
      mkdir $projectsPath/$domain/private/
      mkdir $projectsPath/$domain/private/team
      # Create this here for mon so we dont have to create it later.
      # theres probably a way to get mon to make it itself if it does not exist
      touch $projectsPath/$domain/private/app.log.txt
      
  fi
  
  speedcoach "$domain created"
  # Create the owner file in the team folder
  createOwnerFile $domain $ownerEmail
  
  if isNix
    then
      # Allow the group and owner full access to dir
      chmod -R 770 $projectsPath/$domain/
      # todo: how can we do this without sudo? sudo cause a 400ms delay
      sudo $systemPath/createUser.sh $domain $USER
    else
      # Change owner in case this script as called as root
      sudo chown -R $macUser:staff $projectsPath/$domain
  fi
  
  # if on localhost, append to the hosts file to add the domain
  if isMac
    then
      echo "127.0.0.1 $domain" | sudo tee -a /etc/hosts >/dev/null
  fi

  return 0
}



