# Nextjs Behaviour

- Nextjs is basically a edge time framework

- When we connect a Backend Application do the DB. 
It stays connected all the time. 

- But in Nextjs it only connects to the DB and start the Backend when a request is hit

- So whenever building a Nextjs Application we must check that if te DB connection already exists.
If it already exists utilize that connection. Otherwise create a new connection