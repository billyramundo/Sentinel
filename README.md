# CompSci 390 Project

## Executive Summary
Introducing Sentinel: Our goal is to allow students to control their door from anywhere, enabling them to unlock their door and grant access to whoever they choose with the use of a smart lock. Whether you forget your keys or a friend needs something from your room when you aren’t home, Sentinel will ensure your door can be opened whenever you need. Our hope is to create a functioning smart lock mechanism that can not only be opened with a tap of your phone using an NFC sticker, but also connects to an iOS app which allows others to unlock your door during any given timeframe, and keep track of who has had access to your door and unlocked it.

## Dependencies
- Node v14.18.1
- npm v8.1.1
- Expo v4.12.1
- Firebase JavaScript v8.2.3

## Instructions For Deployment
For the front end, one would need to set up node, npm, and expo (detailed instructions for this in installation instructions). Then, you would need to create a Firebase realtime database and place the database's config in the code in order to connect it to the front end. For the backend, one would need to set up Flask, request, and jsonify from flask; CORS and cross_origin from flask_cors; datetime from datetime; and tunnel_handler, sys, os, pyrebase, subprocess, re, json, signal, psutil, and time. Then you would need to place the database's config in the code in order to connect the database to the backend. 

**insert hardware instructions**

## Backend Repo
Our backend code is in the Sentinel  Repo linked here: https://coursework.cs.duke.edu/compsci390_2021fall/sentinal
