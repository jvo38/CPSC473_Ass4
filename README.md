# CPSC473_Ass4
Jimmy Vo
CPSC 473 - Assignment 4

Installing

1) SSH onto vagrant once you have the VM running.
	- vagrant ssh
	
2) Start your MongoDB server.
	- In a NEW ssh terminal...
		mkdir -p $HOME/mongodb/data
		$HOME/mongodb/bin/mongod --dbpath=$HOME/mongodb/data

3) Start your Redis server.
	- In a NEW ssh terminal...
		$HOME/redis/src/redis-server

4) In a new terminal, go into the 'shared' folder.
	- cd shared

5) Clone the repository into this directory.
	- git clone https://github.com/jvo38/CPSC473_Ass4.git

6) Go into the CPSC473_Ass4 directory.
	- cd CPSC473_Ass4

7) Install all necessary dependencies listed in package.json.
	- npm install

8) Run
	- node server.js

DONE