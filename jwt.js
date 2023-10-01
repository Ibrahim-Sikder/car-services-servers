/*

jwt cheet sheet
1. first required jwt 
var jwt = require('jsonwebtoken');

2.Create jwt tokcent 
example: require('crypto').randomBytes(64).toString('hex')

3. SIGN IN
   example:  app.post('/jwt' , async(req, res)=>{
      const user = req.body;
      console.log(user)
      const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN,  { expiresIn: '1h' })
      console.log(token)
    res.send({token})
    })

    4. set localstora
    example: signIn(email, password)
            .then(result => {
                const user = result.user;
                const loggedUser = {
                    email: user.email
                }
                console.log(loggedUser)
               
                fetch('http://localhost:5000/jwt',{
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(loggedUser)
                })
                .then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    localStorage.setItem('access_token', data.token)
                     navigate(from, { replace: true })
                })

                

            })
            .catch(error => console.log(error));

5. remove localstorage when user logout 
example :  logOut()
        .then(() =>{
            localStorage.removeItem('access_token')
        })
        .catch( error => console.log(error))



6. get token from server
example: const url = `http://localhost:5000/book?email=${user.email}`
    useEffect(()=>{
        fetch(url,{
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            setBookings(data)
        })
    },[url])

    6. verifyJWT
    example :  const verifyJWT = (req, res, next)=>{
console.log('hitting verify')
console.log(req.headers.authorization)
const authorization = req.headers.authorization;
if(!authorization){
  return res.status(401).send({error: true, message: 'unauthorized-access'})
}

const token = authorization.split(' ')[1]
console.log(token)
jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error,decoded)=>{
  if(error){
    return res.status(403).send({error: true, message: 'unauthorized-access'})
  }
  req.decoded = decoded
  next()
})

}

8. verify rout
example :     app.get("/book",verifyJWT, async (req, res) => {
      // console.log(req.headers.authorization)
      const decoded = req.decoded;
   if(decoded.email !== req.query.email){
    return res.status(403).send({error: 1, message: 'forbidden access'})
   }

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/book/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await bookCollection.deleteOne(filter);
      res.send(result) 
    })

*/

const { application } = require("express")

// final note 
// 1. create jwt toiken
// 2. jwt post application
// 3. jwt post api emplement login and set localStorage
// 4. get jwt where use secure jwt api
// 5. verify jwt function 
// 6. verify jwt function call where secure route