fixPermissions ()
{
  chmod 710 $dataPath
  chmod 730 $runningPath
  chmod 730 $portsPath
  chmod 710 $projectsPath
  chmod 700 $logsPath
  chmod 700 $tempPath
  chmod 700 $panelPath
  chmod 700 $backupPath
  chmod 700 $privatePath
  
  if isNix
    then
      sudo chown $USER:projects $dataPath
      sudo chown $USER:projects $runningPath
      sudo chown $USER:projects $portsPath
      sudo chown $USER:projects $projectsPath
  fi  
}


