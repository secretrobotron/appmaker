NudgePad BETA
=============

NudgePad is an open source tool for making websites, apps and more in your browser.

Try it
------

Try it now at http://nudgepad.com

When can I use it?
------------------

NudgePad 1.0 will launch to the general public at some point in late 2013.

If you are a developer, now is a great time to get involved in the NudgePad
community. Your contributions can have a big impact. You also can have
a head start on learning to use NudgePad to build projects faster.

At least one team has already used NudgePad to win a hackathon, amongst other
early successes.


Table of Contents
-----------------

This ReadMe contains 4 sections:

**How to Build Your Project with NudgePad 1.0**

For users who want to use NudgePad to build things.

**How to Build a Community Tool for NudgePad 1.0** 

For developers who want to build tools for NudgePad.

**How to Host NudgePad 1.0** 

For sysadmins who want to setup a server to host NudgePad projects.

**How to Contribute to NudgePad 1.0 core**

For developers who want to become part of the core NudgePad development team.

How to Build Your Project with NudgePad 1.0
===========================================

__CAUTION: NudgePad 1.0 comes out later this year, right now we are in BETA, so things are still broken and subject to change. You've been warned!__

1. Go to http://nudgepad.com
2. Enter a name for your project (don't worry you can change this in seconds later!)
3. Click "Make"

Your project is now live on the web!

There are two ways to build your project:

1. Use the NudgePad Community Tools.

2. Ignore the NudgePad Community Tools and just use simple HTML, CSS, Javascript, images, et cetera.

There is no wrong way to build your project. Sometimes you may want to use the NudgePad Community Tools,
sometimes you may want to just use NudgePad as a simple web server to serve static files.


#### Method 1 - Using NudgePad Community Tools.

Each NudgePad project contains a Home Tool which shows you the various Community Tools you can use to build your project.

For example, you might use the Designer Tool to visually design your site, or the Blog Tool to create blog posts.

#### Method 2 - Using NudgePad as a simple web server


Under the hood, NudgePad projects are simply a folder with simple files in it. Although the Community Tools give you easy methods of modifying those files, you are always free to edit and modify those folders and files directly.

Each project is a single directory on the server like this:

yourprojectname.nudgepad.com/

If you upload a file like "index.html" to this folder, then http://yourprojectname.nudgepad.com/index.html will be the homepage of your project.

That folder called "private/" in your project directory, contains all the NudgePad specific data if you
are using the NudgePad tools to build your project. However, you are free to completely ignore this folder and just use NudgePad as a simple web server.

How to Build a Community Tool for NudgePad 1.0
==============================================

__CAUTION: NudgePad 1.0 comes out later this year, right now we are in BETA, so things are still broken and subject to change. However, we are here to help you build your tool, so don't be shy about contacting us via email or IRC.__

How can I help?
---------------

The core idea of NudgePad is the concept of Community Tools.

These are open source web apps built by the NudgePad Community to enable people to make things
in their browser.

Unlike apps built for consuming content, NudgePad Community Tools are built
for making content. You could build a blogging tool, a drawing tool, an
image editing tool, a vector tool, or something completely new.

Once your tool is working and useful, you can submit it to the core
of NudgePad as a pull request. You could go from idea to tool to having
your pull request accepted and deployed to all NudgePad servers in less
than 24 hours. There is no "Tool Store" in NudgePad. The entire NudgePad community
has access to all Community Tools that are accepted into core at all times.

Creating a Community Tool
-------------------------

To go from "Idea" to "wow my tool is available to all NudgePad Projects", the workflow looks like this:

1. Fork NudgePad & clone to localhost
2. Create the folder and required files for your tool
3. Edit, test and refine your tool.
4. Commit and push to your fork then submit a pull request

Before creating a tool, you may want to have our contact info handy if you run into any problems:

Email: breck@nudgepad.com
Phone: 1-415-937-1984


#### Installing on Localhost

Instructions for installing are now in install.md (https://github.com/nudgepad/nudgepad/blob/master/install.md)

#### Naming Your Community Tool

Getting the name right for your tool is very important. The fastest way to
choose a great name for your tool is to choose a bad name for your tool, and
then build your tool in a way that it is easy to find/replace the name later on.

Your tool name should be: unique and alphabet only. Tools in NudgePad
are always centered around "Making" and not "Consuming", so the name should
convey what the user is going to be doing with that tool.

It's also important to know that your Tool will reserve a single word in the
NudgePad namespace. So if you name your tool "Draw", the variable Draw
will be made a global in the NudgePad client and so it shouldn't interfere with
other community tools or Javascript/DOM reserved words.

There are no ugly closures required here. NudgePad is an open but controlled ecosystem
so we can ensure that there are no namespace conflicts and developers don't have
to create ugly nested hacks to avoid conflicts. Keeping things in core also ensures we can guarantee
to our users a strong, consistent experience, and that there's always one person to blame
if they have a bad experience--Breck!

#### Creating Your Community Tool

Community Tools in NudgePad are meant to be modular and sandboxed and contained in one
folder.

You can create a tool manually by replicating the basic skeleton
like this:

```
tool.js var Draw = new Tool('Draw')
 Draw.set('description', 'Draw and edit illustrations for your project.')
 Draw.set('color', 'blue')
tool.css 
tool.html 
make.space html tool.html
 js tool.js
 css tool.css
```

Once your tool is created, visit http://localhost and create a new project
to see it in action.

The Home Tool should allow you to launch your tool.

As you make changes to your tool, refresh your browser to see them.

NudgePad has a build system that compiles all tools into
a single page webapp for the user. This keeps NudgePad fast.
While developing, NudgePad will watch the tools folder for changes and will
run the build system each time.


Core Objects Available to Your Community Tool
---------------------------------------------

At this point you have created your tool and can open it in your browser. Now
you can start adding functionality to your tool.

Your tool does not actually have to interact with any core API, and in fact,
probably will only make a few method calls to the core to write and read files.

NudgePad exposes an API that your tool can use to read and write files to the user's
project. You also have access to the latest jQuery($), and some other libraries.

Currently, the NudgePad API consists of 2 core objects:

1. Project
2. Tool

#### Project

The Project object is an instance of Space that stores all the data in the project.

To dump the Project instance from console and see what it contains:

```
Project.toString()
```

To get all the pages in a project:

```
var pages = Project.get('pages')
````

To create a new page:

```
Project.set('pages newPageName', 'h1\n content Hello World')
````

#### Tool

Each Tool is an instance of the Tool Object.

You create your tool like this:

```
var Draw = new Tool('Draw')
```

Your tool should have a few standard properties including:

```
// The background color of your Tool's button on the Home screen
Draw.set('color', 'blue')
// The description of your Tool on the Home screen
Draw.set('description', 'Draw something')
```

Your tool will have a few methods from the Tool prototype including:

```
// Open/Close your tool
Draw.open()
Draw.close()
Draw.restart()
```

Your tool can implement a number of standard handlers including:

```
Draw.on('close', function () {})
```

```
Draw.on('open', function () {})
```

Your tool can define and fire its own events like this:

```
Draw.on('foobar', doSomething)
Draw.trigger('foobar')
Draw.off('foobar', doSomething)
```

Other Objects
-------------

#### Screen

Screen is an instance of Space that contains information about the current tab.

```
// Get device info:
Screen.get('device')
// Get user name:
Screen.get('name')
```

#### Screens

Screens is an instance of Space that is composed of all the Screen instances.


```
// How many screens are currently open across the entire project:
Screens.length()
```

#### Launcher

Open an app

```
Launcher.open('Designer')
```

#### Explorer

A simple and dumb text editor.

```
// Pop the editor
Explorer.edit('foobar.html')
// Create a file
Explorer.create('foobar.html', callback)
// Rename a file
Explorer.rename('foobar.html', 'foobar2.html', callback)
// Delete a file
Explorer.remove('foobar.html', callback)

```

#### TextPrompt

Like the browser's built in prompt method, but gives the user a bigger textarea for writing.

```
TextPrompt.open('Some textarea like thing', 'Default value', callback)
```

#### Flasher

Growl like notifications

```
Flasher.success('Your action finished')
Flasher.error('Something went wrong')
```

#### mixpanel

Track aggregate user actions to help improve the tools.

```
mixpanel.track('I did something')

// Add additional info to the stats
mixpanel.track({
  'time' : howLongItTookToCreateThisProject
})

// Note: don't add any user data. We don't want someone to be sending their data,
// just usage data so we can improve the core and Community Tools.
//
// For now, to see the data, Breck needs to add you to our MixPanel account--
// just send me an email.
```


Server Side Routes
------------------

Your tool can access some server side routes that provide read and write access
to a maker's project.

#### GET

```
// Logged in user
http://domain/nudgepad.whoami
```

```
// The domain
http://domain/nudgepad.domain
```

```
// Status info
http://domain/nudgepad.status
```

```
// Logs
http://domain/nudgepad.logs
```

```
// Restart the project
http://domain/nudgepad.restart
```

```
// Dump all the Project Data encoded as Space
http://domain/nudgepad.export
```

#### POST

(fill this in)


How to Host NudgePad 1.0
========================

__CAUTION: NudgePad 1.0 comes out later this year, right now we are in BETA, so things are still broken and subject to change. These steps ALMOST work. However, they definitely do not work flawlessly. Eventually installing NudgePad will be as simple as "npm install nudgepad". Until then, we are here to help you setup hosting, so don't be shy about contacting us via email or IRC.__

Instructions for installing are now in install.md (https://github.com/nudgepad/nudgepad/blob/master/install.md)

### Creating a Project API

Post to /create

```
domain newproject.breck.com
email breck7@gmail.com
timestamp 1234325434

```



How to Contribute to NudgePad 1.0 core
======================================

__CAUTION: NudgePad 1.0 comes out later this year, right now we are in BETA, so things are still broken and subject to change. In other words, we always are on the lookout for talented developers to help us on the core of NudgePad!__

To get involved with core, play around with NudgePad, read about our design philosophy, and get in touch!

You could also create issues or comment on existing issues.

Design Goals
------------

Ultimately our goal is to build a tool that not only expert users will use because it's the fastest, best
tool out there, but to build a tool that everyone will use because it's also the simplest, most user
friendly tool out there.

We want to not only enable the 5 million people who can currently create websites and software to create
more projects better and fast than before, but we want to enable the other few billion Internet users
to be able to make things. We want to enable people to **work together** on projects better than they ever
have before.

Some somewhat more specific goals:
- 100 milliseconds to create a new blank project or project from template
- 100 milliseconds to move a project to a new domain
- 100,000 projects per server
- Copy/pasting of components and entire projects
- Instant updating of a website from any device
- Add server side code to any project
- Runs great in the cloud or on localhost
- Community Tools work seamlessly together
- High quality Community Tools that are **better** than their closed source/proprietary alternatives
- Enable self hosting
- Simple conceptual models throughout
- Lead way not only on improving and simplifying NudgePad, but also work hard on contributing improvements
to underlying Internet and web technologies


Core Architecture Concepts
--------------------------

The first core concept in NudgePad is the Project. A maker is always working on a single
project. A project is always just a single folder on the server. There is no
database used, everything is stored on disk. Each project can have multiple team members who
can work together at the same time, and each team member record is simple a file in the team/ folder.

Projects can be tiny or huge. All projects are stored in /nudgepad/projects/.
Each Project has a name, which is also the domain name and folder name for the project.
Each project is a website, and a node.js Express app as well. Projects can
evolve into anything.

The second core concept in NudgePad is the Community Tool. Makers work on their project in
the browser by using Community Tools. Each tool is just HTML, CSS, and Javascript, that interacts
with the user's project files via some core APIs.

The third core concept in NudgePad is the Space language. As much as possible, we rely
on Space to encode and store data. We believe it is critical to not only simplify and
improve the UX of making things, but also to simplify and improve the underlying
technologies of the web and Internet.


Overview of the Codebase
------------------------

client
------

This code contains all of the front end code of the NudgePad user interface.

It also contains all the Community Tools.

client/
client/build.js - The build script that compiles core and all Community Tools into 1 html, css, and
javascript file.
client/core - A tiny bit of core code that provides some basics to the Community Tools
client/tools - This is where all the action is. These Community Tools are apps that make it easy for team members
to work on their projects.
client/public - Some additional pages, external libraries, and some css and images used by core.
client/production - Contains compiled nudgepad files. These are auto generated.
client/Makefile - some convenience commands for working on the client.

server
------

Each NudgePad Project is a website--specifically an Express app running as its own process.

The API here is still being simplified a bit, but the basic pattern is to create a module that
extends the user's project like this:

    function MyModuleName (app) {
      app.get('/helloWorld', function (req, res, next) {
        // do something
      })
    }
    module.exports = MyModuleName

Any file in a Project's packages folder is expected to follow that convention and will
be included when the project starts like this:

    require('./mymodulename.js')(app)

system
------

The code in system is responsible for creating new projects on the machine, load
balancing, proxying requests to projects, and offering tools to sysadmins for
managing a NudgePad server.

It's currently written mostly in BASH, but node scripts are welcome as well.

A fully running NudgePad server consists of:

- A control panel Express app running on port 4004
- user projects which run on ports 4005 - 9000
- An http-proxy app which sits in front of all of those on port 80.

Those ports are also configurable.

Overview of data storage
------------------------

All user data is stored in /nudgepad/

NudgePad does not use a database. Our thoughts are a database is premature optimization for
almost all projects. There are orders of magnitude more tools and ways to work with files
in the file system than on databases. This design decision makes it easy for projects to be
a git repo, to be moved from one server to another, to be modified not only by NudgePad
but by other tools, etc.

We write user data at the root level as opposed to some nested library on your machine because we
believe it greatly simplifies sysadmin and debugging.

The folders in /nudgepad are:

- /nudgepad/active Contains simple text files where filename is the domain and content is the port. As projects start and stop, files are created and removed.
- /nudgepad/backup Contains a backup copy of /nudgepad/projects that eschews some operational data for faster backups.
- /nudgepad/logs Contains log files for the panel server and proxy server (not individual projects!).
- /nudgepad/panel Allows you to skin the NudgePad panel look and feel.
- /nudgepad/ports Contains simple text files where filename is the port and content is the domain. As projects start and stop, files are created and removed.
- /nudgepad/projects Contains all the data for every project.
- /nudgepad/temp Contains temp files for panel and proxy.

The data for a project "foo.com" is stored in /nudgepad/projects/foo.com/ and is all served publicly by Express.

So a file /nudgepad/projects/foo.com/foo.html would be available at foo.com/foo.html

There is also a private folder where all NudgePad conventions are stored and that looks like this:

- packages/ Contains Node.js packages to include onstart. Each package extends the app object. So your package should export one function which takes an express app object as a param and extends it.
- pages/ Contains the pages that are edited by the Designer Tool. Encoded in Space/Scraps
- timelines/ Stores diffs of pages generated by Designer tool. Encoded in Space.
- team/ Stores user records. Each user is a file encoded in Space.


Target Users
------------

Long term NudgePad is targeted at creative people who like making things. That's
5% of the general population.

Short term NudgePad is targeted at web savvy, early adopters who have a lot
of project ideas and want faster and better ways to make them real. That's
5% of the creatives.

The projects creatives want to make are:
- Clickable websites 20%
- Single page sites 20%
- Mobile apps 20%
- Blogs 5%

The features these people need are:
- Instant project creation 100%
- Tools in the browser 100%
- Instant live website for each project 100%
- Import media tool 100%
- Easy export 100%
- Easy import 100%
- Reliability and backups 100%
- Easy updating of content 100%
- Works great on localhost 10% need it 100%
- Multiple users per project 50%
- Fast changing of domains 40%
- Custom domains 40%
- Real time multi user env 10%
- Visual design tools 20%
- Blog post writing tool 5%
- Mobile app packaging tool 5%
- Image editing tool 5%
- Drawing tool 5%
- Code editing tool 2%
- Self hosted NudgePad 1%

Our goal is to deliver all of this in a product with a simple and cohesive conceptual model.

The features developers need:
- Develop NudgePad entirely on localhost 100%
- Fast time to create a new project 100%
- Easy access to data 100%
- Easy to setup automatic backups 100%
- Simple API 90%
- Great API documentation 90%
- Simple to install NudgePad on many machines 50%
- Easy install from git clone 50%
- Easy install from npm 50%

Team
----

#### Leadership
- Architect: Breck Yunits github.com/breck7 breck@nudgepad.com
- Senior Engineer: Ben Zulauf github.com/bczulauf ben@nudgepad.com

#### Toolmakers
(add)



Build Status
------------

[![Build Status](https://travis-ci.org/nudgepad/nudgepad.png?branch=master)](https://travis-ci.org/nudgepad/nudgepad)
