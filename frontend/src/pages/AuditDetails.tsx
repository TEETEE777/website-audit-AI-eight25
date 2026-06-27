import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAudit } from "../api/auditApi";


export default function AuditDetails(){

  const { id } = useParams();

  const [audit,setAudit] = useState<any>(null);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    const load = async()=>{

      try{

        const response = await getAudit(Number(id));

        setAudit(response.data);

      }catch(error){

        console.error(error);

      }finally{

        setLoading(false);

      }

    };


    load();

  },[id]);



  if(loading){

    return (
      <div className="p-10">
        Loading...
      </div>
    )

  }



  if(!audit){

    return (
      <div className="p-10">
        Audit not found
      </div>
    )

  }



  return (

    <div className="min-h-screen bg-blue-50 p-10">

      <div className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-2xl
        shadow-lg
        p-8
      ">


        <div className="flex justify-between mb-8">


          <div>

            <h1 className="text-3xl font-bold">
              Audit Details
            </h1>

            <p className="text-slate-500 mt-2">
              {audit.url}
            </p>

          </div>


        <Link
            to="/history"
            className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-3
                py-1.5
                h-9
                rounded-lg
                text-sm
                transition
            "
            >
            Back
        </Link>


        </div>




        <div className="grid grid-cols-4 gap-5">


          <Score
            title="SEO"
            value={audit.score.seo_score}
          />

          <Score
            title="Accessibility"
            value={audit.score.accessibility_score}
          />

          <Score
            title="UX"
            value={audit.score.ux_score}
          />

          <Score
            title="Overall"
            value={audit.score.overall_score}
          />


        </div>



        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            AI Insights
          </h2>


          {Object.entries(audit.analysis.insights)
          .map(([key,value]:any)=>(

            <div
              key={key}
              className="
              border
              rounded-xl
              p-5
              mb-4
              "
            >

              <h3 className="font-bold capitalize">
                {key.replace("_"," ")}
              </h3>

              <p className="mt-2 text-slate-600">
                {value}
              </p>

            </div>

          ))}


        </div>



      </div>

    </div>

  )

}



function Score({
 title,
 value
}:{
 title:string,
 value:number
}){


return (

<div className="
bg-blue-50
border
rounded-xl
p-5
">

<p className="text-slate-500">
{title}
</p>

<p className="text-4xl font-bold mt-2">
{value}
</p>


</div>

)

}