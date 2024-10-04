# cpsc334-boids (Waltz of Waning Wings)

A generative art piece that involves lots of colorful birds and one very passionate predator. Module 1 submission for CPSC 334 (Creative Embedded Systems).

Project video: https://youtu.be/l7_3F13enJQ

## Running the code on your own

1. Clone the repo
2. cd into the repo from the terminal
3. Run `open index.html` from the terminal

## Code Explanation

- `main.js` contains the animation loop, some settings such as how many prey birds there are and toggle for draw trail. It also contains essential canvas operations
- `bird.js` contains the class definition of Bird and BirdFactory. The Bird class is designed so that you can fully customize each parameter, including visual range, speed limit, turn factor, centering factor, avoid factor, predator avoid factor, minimum distance from other birds, matching factor, size, and color. You can also find the essential `update` and `drawbird` functions here. Bird death (on collision with predator) is defined here as well.

Essentially, the birds's movements are based on a set of rules. They try to keep within bounds of the canvas, fly towards the center of the flock, try to avoid getting to close to other birds, they REALLY try to avoid the predator, and they try to match velocity of their neighbors.

A lot of the parameters for the bird class are dynamic and adjust to the size and proportions of the screen. You can investigate this feature more in the code itself, but simply put, as the screen size/proportions change, the program's behavior varies, but the dynamic adjustments allow the birds to behave semi-normally without outstanding bugs.

- `predator.js` contains the class definition of the Predator. Here you can tune the parameters of the predator, which is also a bird, so it extends the constructor from the Bird class.

## Setting up "run on start up" for a Raspberry Pi

1. Create a `start.sh` in the same folder as `index.html`. It should look something like

```shell
#!/bin/bash
cd "$(dirname "$0")";
chromium-browser --start-maximized --start-fullscreen file://$(pwd)/index.html
```

2. Create a `run_on_start_up.service` file inside /lib/systemd/system. It should look something like

```service
[Unit]
Description=Open index.html in fullscreen on startup
After=graphical-session.target network-online.target

[Service]
ExecStart=/home/student334/Documents/cpsc334-boids/start.sh
User=student334
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/student334/.Xauthority"
Environment="XDG_RUNTIME_DIR=/run/user/1000"

[Install]
WantedBy=multi-user.target
```

Note: this is not the recommended way to start a browser session on startup, just what I've elected to use and it worked for me. Creating the service file in `/etc/systemd/system/` is best practice.

3. Enable and reload the service

```shell
sudo systemctl enable run_on_start_up.service
sudo systemctl daemon-reload
sudo systemctl restart run_on_start_up.service
```

**Note: you may need to adjust the settings (which are in the form of constants in `main.js`) in order to get optimal performance depending on which Pi you are using. Turning off path tracing may be advisable.**

## Helpful commands for debugging

There are 3 commands that are your best friends when debugging service issues.

1. This tells you some basic information about the service: `sudo systemctl status <service name>`
2. This contains more detailed log of the service, including very helpful error messages: `journalctl -u <service name>`
3. Use this when you want to know the order in which the services are started on start up: `journalctl -xe`
