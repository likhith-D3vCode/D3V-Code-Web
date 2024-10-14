import 'bootstrap-icons/font/bootstrap-icons.css'
function CourseCard(){
   return <>
   
   <div className="card imgcard" style={{width: "18rem"}}>
  <img src="https://img.freepik.com/premium-vector/programmers-working-website-development-using-different-programming-languages-vector-illustration_1327465-3.jpg?w=996" className="card-img-top" alt="..."/>
  <div className="card-body">
    <div >
      <p>Web-Development(Front end)</p>
      <div className='Playbtn'>
      <p>0%</p>
      <button><i className="bi bi-play-circle"></i></button>
      </div>
      
    </div>
  </div>
</div>
   </>
}

export default CourseCard