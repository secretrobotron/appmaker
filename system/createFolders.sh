if [ ! -d "$dataPath" ]
  then
    sudo mkdir $dataPath
    sudo chown $USER $dataPath
fi

if [ ! -d "$projectsPath" ]
  then
    mkdir -p $projectsPath
    mkdir -p $runningPath
    mkdir -p $portsPath
    mkdir -p $tempPath
    mkdir -p $logsPath
    mkdir -p $backupPath
    mkdir -p $privatePath
    fixPermissions
fi
