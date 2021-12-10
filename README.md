# CompSci 390 Project

## Executive Summary
**Introducing Sentinel**: Our goal is to allow students to control their door from anywhere, enabling them to unlock their door and grant access to whoever they choose with the use of a smart lock. Whether you forget your keys or a friend needs something from your room when you aren’t home, Sentinel will ensure your door can be opened whenever you need. Our hope is to create a functioning smart lock mechanism that can not only be opened with a tap of your phone using an NFC sticker, but also connects to an iOS app which allows others to unlock your door during any given timeframe, and keep track of who has had access to your door and unlocked it.

## Dependencies
- Node.js v14.18.1
- npm v8.1.1
- Expo v4.12.1
- Firebase JavaScript v8.2.3

## Instructions For Deployment
**Please note:** Detailed installation/deployment instructions are available in [`doc/app-maintenance-documentation.md`](doc/app-maintenance-documentation.md).
### Front End
For the front end, one would need to set up `node`, `npm`, and `expo`. Then, you would need to create a Firebase realtime database and connect the frontend to the new database by simply replacing the `config` variable in `screens/Login.js`.
### Backend
For the backend, one would need to set up `Python` and install `pyrebase`, `Flask`, and `flask-cors`. `Localtunnel` client must also be installed. Finally, the backend database config variable would need to be replaced with the new Firebase realtime database's config, exactly as was done in the frontend.
### Hardware
In order to set up the hardware, one would simply need to follow the instructions included in the box, which merely entails doing the following:
  1. Attach the Sentinel Device housing to the door, making sure to fit the deadbolt's interior thumbturn into the lock sleeve. Attachment can be done non-destructively, and the use of adhesive hanging strips is recommended.
  2. Connect the servo motor, already situated in its housing, to the Sentinel Device's motor port.
  3. Connect the Sentinel Device to a nearby power outlet.
    - Be sure to wire it such that door motion will *not* affect the connection! E.g., running the wire horizontally, toward the "hinge" side of the door is highly recommended.
  4. Register the Sentinel Device using the app's "Register Door" page, and enter the 10-digit code that came in the box when prompted. Happy unlocking!

Otherwise, if you are recreating or modifying the hardware, then see the detailed hardware installation instructions [here](https://coursework.cs.duke.edu/compsci390_2021fall/sentinal/device-backend).

## Device Backend Repository
Our backend code is all located in the [Sentinel Device Backend Repo](https://coursework.cs.duke.edu/compsci390_2021fall/sentinal), including detailed installation instructions.
