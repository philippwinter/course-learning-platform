# CourseLearningPlatform

The course learning platform is a project aimed at providing a unified learning environment for several technical topics.
It is maintained by Jonas Heidecke, Lukas Struck & Philipp Winter as part of their technology class.

The code is licensed under the MIT license, so you're free to copy, distribute, change, or do whatever you want with our code,
as long as the copyright notice remains at each destination.

## Develop

### Install

This will install the project into a new folder inside your home directory and install all dependencies.
To succeed, you have to have *node.js* and *npm* installed. Please refer to the respective manuals to find out how to do so.

Change into the parent directory.
> cd ~

Clone the repository maintaining the current development process. Consider this as being usually functional, but not stable.
> git clone https://github.com/philippwinter/course-learning-platform.git

Change into the created directory.
> cd course-learning-platform

Fetch dependencies using npm.
> npm install

### Start to code

The project was created using eclipse with the extension provided by nodeclipse. Therefore, you have to simply import the *course-learning-platform* directory as a project in your workspace to start hacking.

## Start

Starting the project is as simple as writing one line of code. Per default, the server is launched on port 8888. In the future, there may be a configuration file, where this can be changed.
> node index.js