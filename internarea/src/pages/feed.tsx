import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Feed() {
const { t } = useTranslation();
const [posts,setPosts] = useState<any[]>([]);
const [content,setContent] = useState("");
const [friendCount] = useState(3);
const [todayPosts,setTodayPosts] = useState(0);
const [commentTexts,setCommentTexts] = useState<Record<string,string>>({});
const [image,setImage] = useState<File | null>(null);


const getLimit = () =>{
if(friendCount > 10) return Infinity;
return friendCount;
};


useEffect(()=>{
fetchPosts();
},[]);



const fetchPosts = async()=>{

try{

const res = await fetch("http://localhost:5000/api/post");
const data = await res.json();

setPosts(data);


const today = new Date();

today.setHours(0,0,0,0);


const count = data.filter((p:any)=>{

const d = new Date(p.createdAt);

return d >= today;

}).length;


setTodayPosts(count);

}catch(err){
console.log(err);
}

};



const handleCreatePost = async()=>{

if(!content.trim()) return;


if(todayPosts >= getLimit()){
alert(t("feed.postingLimitReached"));return;
}


try{

const formData = new FormData();

formData.append("friendCount",friendCount.toString());
formData.append("userName","Current User");
formData.append("content",content);

if(image){
formData.append("media",image);
}


const res = await fetch(
"http://localhost:5000/api/post",
{
method:"POST",
body:formData
}
);

const data = await res.json();


if(!res.ok){
alert(data.message);
return;
}


setPosts(prev=>[data,...prev]);

setTodayPosts(prev=>prev+1);

setContent("");
setImage(null);


}catch(err){

console.log(err);

}

};





const handleLike = async(post:any)=>{

const res = await fetch(

`http://localhost:5000/api/post/${post._id}/like`,

{
method:"PUT"
}

);

const data = await res.json();


setPosts(prev=>

prev.map(p=>

p._id===post._id
? data
: p

)

);

};






const handleShare = async(post:any)=>{

const res = await fetch(

`http://localhost:5000/api/post/${post._id}/share`,

{
method:"PUT"
}

);

const data = await res.json();


setPosts(prev=>

prev.map(p=>

p._id===post._id
? data
: p

)

);

};






const handleComment = async(post:any)=>{


const text = (commentTexts[post._id] || "").trim();

if(!text) return;



const res = await fetch(

`http://localhost:5000/api/post/${post._id}/comment`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

userName:"Current User",

text

})

}

);



const data = await res.json();



setPosts(prev=>

prev.map(p=>

p._id===post._id
? data
: p

)

);



setCommentTexts(prev=>({

...prev,

[post._id]:""

}));

};

const handleDelete = async (id:any) => {

const res = await fetch(
`http://localhost:5000/api/post/${id}`,
{
method:"DELETE"
}
);

if(res.ok){

setPosts(prev=>
prev.filter(post=>post._id !== id)
);

}

};




return(

<div className="min-h-screen bg-gray-100">

<div className="max-w-3xl mx-auto p-6">



<div className="bg-white rounded-xl shadow p-5 mb-6">

<h1 className="text-2xl font-bold">
{t("feed.publicSpace")}</h1>


<div className="grid grid-cols-3 gap-4 mt-4">


<div className="bg-blue-100 p-3 rounded">

<h2>{friendCount}</h2>

<p>{t("feed.friends")}</p>

</div>



<div className="bg-green-100 p-3 rounded">

<h2>{todayPosts}</h2>

<p>{t("feed.postsToday")}</p>

</div>



<div className="bg-purple-100 p-3 rounded">

<h2>

{

getLimit()===Infinity

?

"∞"

:

getLimit()-todayPosts

}

</h2>

<p>{t("feed.remaining")}</p>

</div>


</div>

</div>






<div className="bg-white rounded-xl shadow p-5 mb-6">


<textarea

rows={4}

className="w-full border rounded p-3"

placeholder={t("feed.whatsOnYourMind")}
value={content}

onChange={(e)=>setContent(e.target.value)}

/>



<input

type="file"

accept="image/*"

className="mt-4"

onChange={(e)=>{

const file=e.target.files?.[0];

if(file){

setImage(file);

}

}}

/>



<button

onClick={handleCreatePost}

className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"

>

{t("feed.createPost")}
</button>


</div>






{posts.map((post)=>(


<div

key={post._id}

className="bg-white rounded-xl shadow p-5 mb-5"

>


<div className="flex items-center gap-3">


<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">

{post.userName?.charAt(0)}

</div>



<div>

<h3 className="font-semibold">

{post.userName}

</h3>

<p>
{new Date(post.createdAt).toLocaleString()}
</p>

</div>

</div>



<p className="mt-4">

{post.content}

</p>



{

post.media && (

<img

src={post.media}

alt="post"

className="mt-4 rounded-lg max-w-sm"

/>

)

}




<div className="flex gap-3 mt-4">


<button

onClick={()=>handleLike(post)}

className="bg-red-500 text-white px-4 py-2 rounded"

>

{t("feed.like")} ({post.likes || 0})

</button>



<button

onClick={()=>handleShare(post)}

className="bg-green-600 text-white px-4 py-2 rounded"

>

{t("feed.share")} ({post.shares || 0})

</button>


</div>





<div className="flex gap-2 mt-4">


<input

placeholder={t("feed.writeComment")}
className="flex-1 border rounded px-3 py-2"

value={commentTexts[post._id] || ""}

onChange={(e)=>{

setCommentTexts(prev=>({

...prev,

[post._id]:e.target.value

}));

}}

/>



<button

onClick={()=>handleComment(post)}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

{t("feed.comment")}
</button>


</div>




<div className="mt-4">

{

post.comments?.map(

(c:any,i:number)=>(

<p key={i}>

<b>{c.userName}</b> : {c.text}

</p>

)

)

}

</div>


</div>


))}



</div>

</div>

);

}

export default Feed;