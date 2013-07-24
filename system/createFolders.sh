if [ ! -d "$dataPath" ]
  then
    sudo mkdir $dataPath
    sudo chown $USER $dataPath
fi

mkdir -p $projectsPath
mkdir -p $runningPath
mkdir -p $portsPath
mkdir -p $tempPath
mkdir -p $logsPath
mkdir -p $backupPath
mkdir -p $panelPath
mkdir -p $privatePath

fixPermissions
