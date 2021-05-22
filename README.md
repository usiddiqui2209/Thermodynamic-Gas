# Thermodynamic Gas
### By Usman Siddiqui

## What is it?
This is a physics simulation of a thermodynamic gas. The simulation assumes gas particles are monoatomic and interact only through elastic collisions with other gas molecules and the walls of the container.

## But wait, isn't that unrealistic?
Yes! Gas particles are not (all) monoatomic. And they do not (always) undergo elastic collisions. Most are also subject to intermolecular forces. Nevertheless, this simuation provides a useful source of physics data for analysing gas particles under a simple thermodynamic model.

Oh, and it also runs in linear time!

## OK great, how do I use it?
Simple! Download the repo to your desktop and follow the instructions below.

### Python (Recommended)
To run the Python version, first ensure you have the latest version of [Spyder](https://www.spyder-ide.org/) installed. Then:

- Open Config.py, set the desired parameters, and save the file

- Open InitialState.py and run it by pressing F5 in Spyder (this produces an `InitialState.csv` file according to the parameters specified in Config.py, which is necessary for the simulation to run)

- (Optional) If outputting data to file, open WriteOutput.py, customize output data according to instructions, and save the file

- Open App.py and run it by pressing F10 in Spyder

- After animation has concluded, close the animation window (important if outputting data)

- Output data will be saved in a CSV file with a numerical timestamp (e.g. `1542627068.csv`)

NOTE: The initial state of the system is loaded from `InitialState.csv` file each time. This is
      important so that the experiment can be repeated multiple times from the same
      initial state. To generate a new state, InitialState.py MUST be run before running App.py each time.

######## FILES INCLUDED ########

- App.py [Application entry point]

- Ball.py [Ball class containing methods for collision prediction, rebound velocity calculation and ball rendering]

- Config.py [Configuration file containing parameters that can be modified by the user]

- InitialState.py [Standalone module which generates an initial state according to the configurations in Config.py and saves this arrangement to a CSV file (e.g. `InitialState.csv`)]

- ParseState.py [Loads the initial state from a CSV file]

- WriteOutput.py [Outputs data to a CSV file for data analysis in other software]

### Javascript (Not recommended)
To run the Javascript version, first ensure you have the latest of [NodeJS](https://nodejs.org/en/) and Browserify[https://browserify.org/] installed. Then:

- Open InitialConditionGenerator.js and configure the initial state of the system.

- Save the file and run `node InitialConditionGenerator` which will generate your initial state file.

- Navigate to `/src` and run `browserify App.js -o build.js`. This will compile your modules.

- Navigate to the root directory and open `index.html`. You will see your simulation running on the canvas.

## Issues? Let me know
Get in touch with me at usman.siddiqui2209@gmail.com to report any issues or bugs.