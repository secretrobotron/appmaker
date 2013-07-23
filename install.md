Installing NudgePad
===================

The best way to develop a NudgePad Community tool is to install a copy of NudgePad on localhost.

NudgePad currently works best on Mac OS X and Nix (mostly used on Ubuntu).

NudgePad requires node v0.8.*. NudgePad does NOT currently work reliably with
node v0.10.x due to a proxy/websocket (issue #1).

### Nix - Update your system (instructions are for Ubunutu)

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install git gcc make imagemagick sendmail-bin python-software-properties python g++

### Nix & Mac - Install mon

    cd
    git clone https://github.com/visionmedia/mon.git
    cd mon
    sudo make install

### Nix & Mac - Install N

    cd ~
    git clone https://github.com/visionmedia/n.git
    cd n
    sudo make install

### Nix & Mac - Install Node 0.8.25

    sudo n 0.8.25

### Nix & Mac - Increase the Number of iNotify Watches (is this still necessary?)

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

### Nix - add projects group

    sudo groupadd projects
    # where ubuntu = your username
    sudo usermod -a -G projects ubuntu

### Nix - update system's hostname

    read newHostname
    # enter your hostname
    echo $newHostname | sudo tee /etc/hostname >/dev/null
    sudo hostname $newHostname
    # Name your hostname with the root domain of the server
    # We recommend then adding a *.domain.com CNAME record to your DNS

### Nix & Mac - Clone NudgePad

    cd ~
    # Put your fork here
    git clone https://github.com/nudgepad/nudgepad.git

### Nix & Mac - Install NudgePad

    cd nudgepad
    # need to install modules globally so different sites can use em
    sudo npm install -g
    # then install it locally, because npm is weird :)
    npm install

### Nix & Mac - Start NudgePad

    ~/nudgepad/system/nudgepad.sh start
    # Go to http://localhost

### Nix & Mac - Create "npd" shortcut. Optional.

    echo "alias npd='~/nudgepad/system/nudgepad.sh'" >> ~/.bash_profile
    # The next line is to allow you to run npd as sudo if you need to for some things.
    echo "alias sudo='sudo '" >> ~/.bash_profile
    # Reload your bash_profile to get the npd command
    source ~/.bash_profile


Troubleshooting
---------------


Occasionally you'll need to update your environment's PATH variable to make
sure that the node_modules/.bin folder is included. For example, you may need
to add this to your .bash_profile or .bashrc:

    PATH=$PATH:~/node_modules/.bin

Or on Ubuntu:

    PATH=$PATH:/home/ubuntu/node_modules/.bin

