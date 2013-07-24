Installing NudgePad
===================

Installing on a Mac
-------------------

### Create NudgePad folder

    sudo mkdir /nudgepad
    sudo chown $whoami:staff /nudgepad

### Install mon

    cd /nudgepad
    git clone https://github.com/visionmedia/mon.git
    cd mon
    sudo make install

### Install N

    cd /nudgepad
    git clone https://github.com/visionmedia/n.git
    cd n
    sudo make install

### Install Node 0.8.25

NudgePad requires node v0.8.*. NudgePad does NOT currently work reliably with node v0.10.x due to a proxy/websocket (issue #1).

    cd /nudgepad
    sudo n 0.8.25

### Clone NudgePad

    cd /nudgepad
    git clone https://github.com/nudgepad/nudgepad.git

### Install NudgePad

    cd nudgepad
    # need to install modules globally so different sites can use em
    sudo npm install -g
    # then install it locally, because npm is weird :)
    npm install
    # move node_modules to parent dir
    mv /nudgepad/nudgepad/node_modules /nudgepad/

### Start NudgePad

    /nudgepad/nudgepad/system/nudgepad.sh start
    # Go to http://localhost

### Create "npd" shortcut. Optional.

    echo "alias npd='/nudgepad/nudgepad/system/nudgepad.sh'" >> ~/.bash_profile
    # The next line is to allow you to run npd as sudo if you need to for some things.
    echo "alias sudo='sudo '" >> ~/.bash_profile
    # Reload your bash_profile to get the npd command
    source ~/.bash_profile

Installing on Nix
-----------------

Instructions are for Ubuntu

### Update System

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install git gcc make imagemagick sendmail-bin python-software-properties python g++

### Create NudgePad folder

    sudo mkdir /nudgepad
    sudo chown `whoami`:`whoami` /nudgepad

### Install mon

    cd /nudgepad
    git clone https://github.com/visionmedia/mon.git
    cd mon
    sudo make install

### Install N

    cd /nudgepad
    git clone https://github.com/visionmedia/n.git
    cd n
    sudo make install

### Install Node 0.8.25

NudgePad requires node v0.8.*. NudgePad does NOT currently work reliably with node v0.10.x due to a proxy/websocket (issue #1).

    cd /nudgepad
    sudo n 0.8.25

### Increase the Number of iNotify Watches (is this still necessary?)

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

### Add projects group

    sudo groupadd projects
    # where ubuntu = your username
    sudo usermod -a -G projects ubuntu

### Update system's hostname

    read newHostname
    # enter your hostname
    echo $newHostname | sudo tee /etc/hostname >/dev/null
    sudo hostname $newHostname
    # Name your hostname with the root domain of the server
    # We recommend then adding a *.domain.com CNAME record to your DNS

### Clone NudgePad

    cd /nudgepad
    git clone https://github.com/nudgepad/nudgepad.git

### Install NudgePad

    cd nudgepad
    # need to install modules globally so different sites can use em
    sudo npm install -g
    # then install it locally, because npm is weird :)
    npm install
    # move node_modules to parent dir
    mv /nudgepad/nudgepad/node_modules /nudgepad/

### Start NudgePad

    /nudgepad/nudgepad/system/nudgepad.sh start
    # Go to http://localhost

### Create "npd" shortcut. Optional.

    echo "alias npd='/nudgepad/nudgepad/system/nudgepad.sh'" >> ~/.bash_profile
    # The next line is to allow you to run npd as sudo if you need to for some things.
    echo "alias sudo='sudo '" >> ~/.bash_profile
    # Reload your bash_profile to get the npd command
    source ~/.bash_profile


Troubleshooting
---------------


Occasionally you'll need to update your environment's PATH variable to make
sure that the node_modules/.bin folder is included. For example, you may need
to add this to your .bash_profile or .bashrc:

    PATH=$PATH:/nudgepad/nudgepad/node_modules/.bin

Or on Ubuntu:

    PATH=$PATH:/nudgepad/nudgepad/node_modules/.bin


Uninstalling
------------

Stop NudgePad

    npd stop

Delete /nudgepad folder (WARNING: This deletes all your Project data)

    rm -rf /nudgepad

If you added a shortcut in your bash_profile, remove that:

    vim ~.bash_profile

Remove any domain records NudgePad created in your hosts file:

    vim /etc/hosts

On Nix, you may need to delete some users.

