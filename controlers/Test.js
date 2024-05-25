let arr=[1,2,3,2,5,1,3]
let map={}

arr.forEach((num) => {
    if(num in map){
        map[num].push(num)
    }else{
        map[num]=[num]
    }
});
console.log(map)

Object.keys(story).map((s)=>{
    console.log("ss",story[s][0].story)
  })
  const myArray = [1, 2, 3];
  const arrayAsString = JSON.stringify(myArray);

  return (
    <Link to={`/my-route/${encodeURIComponent(arrayAsString)}`}>
      Go to My Route
    </Link>
  );

  const { arrayParam } = useParams();
  const decodedArray = decodeURIComponent(arrayParam);
   myArray = JSON.parse(decodedArray);
