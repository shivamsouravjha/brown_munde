import React,{useEffect,useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import History_list from './history_list';
const Rider_History = ()=>{
    const uid = useParams().uid;
    const [loadedattende,setloadedattende] = useState('');
    const get_events = async ()=>{
        try{
            const response = await fetch(`https://taxibackendf.herokuapp.com/api/booking/historyuid/${uid}`,{
                method:"GET",headers:{"Content-Type":"application/json"}
            })   
            const jsonData = await response.json()
            console.log(jsonData.logbook);

            setloadedattende(jsonData.logbook);
        }catch(err)
        {
            console.log('issues');
        }
    };
    useEffect(()=>{
        get_events();
    },[]);
    console.log(loadedattende);

    return <History_list items={loadedattende}/>

    ;
};
export default Rider_History;