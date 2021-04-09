const mongoose = require('mongoose');

const Erur = require('../Service_Model/Error');
const Availability_Schema = require('../Service_Model/availability');
const Rider_Schema = require('../Service_Model/masonry');
const Booking_Schema = require('../Service_Model/logging');


const availability  = async (req,res,next)=>{
    const driver_id = req.params.did;
    console.log(driver_id);

    let avail_exist;
    try{
        avail_exist = await Availability_Schema.findOne({driver_id:driver_id});
      }catch(err){
        const error = new Erur(
          'Loggin in failed, please try again later.',
          500
        );
        return next(error);
      }
      if(avail_exist.availability == true){
        avail_exist.availability = false;
      }
      else{
        avail_exist.availability = true;

      }
      try {
        await avail_exist.save();
       } catch (err) {
         const error = new Erur(
           'Avail up failed, please try again later.',
           500
         );
         return next(error);
       }
 
      res.status(201).json({message: 'Updated'});

};
const update_location  = async (req,res,next)=>{
    const _id = req.params.did;
    let location_update;
    try{
        location_update = await Driver_Schema.findOne({_id:_id});
      }catch(err){
        const error = new Erur(
          'Loggin in failed, please try again later.',
          500
        );
        return next(error);
      }
      const {location}= req.body;
      location_update.location=location;
      try {
        await location_update.save();
       } catch (err) {
         const error = new Erur(
           'Updation up failed, please try again later.',
           500
         );
         console.log(error);

         return next(error);
       }
       res.status(201).json({message: 'Location Updated'});

};
const booking = async(req,res,next) =>{
    const rider_id = req.params.uid;
    let rider_data;
    let driver_data;
    const {driver_id,destination}=req.body;
  console.log(driver_id);
    try{
        driver_data = await Driver_Schema.findOne({_id:driver_id});
        rider_data = await Rider_Schema.findOne({_id:rider_id});
    }catch(err){
        const error = new Erur(
            'Loggin in failed, please try again later.',
            500
          );
          return next(error);
    } 
    console.log(driver_data);

    const initial_rider_location = rider_data.location;
    const initial_driver_location = driver_data.location;
    const status = true;
    const new_booking = new Booking_Schema({rider_id,driver_id,initial_rider_location,initial_driver_location,
                            destination, status          
    
    });
    try {
        await new_booking.save();
       } catch (err) {
         const error = new Erur(
           'Updation up failed, please try again later.',
           500
         );
         return next(error);
       }
       res.status(201).json({message: 'Trip Started!'});
};
const history_uid = async(req,res,next) =>{
    const rider_id = req.params.uid;
    let history;
  try {
    history = await Booking_Schema.find({rider_id:rider_id});///////////////removed populate
  } catch (err) {
    const error = new Erur(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!history ) {
    return next(
      new Erur('User is introvert', 404)
    );
  }

  res.json({ logbook: history});
};


const history_did = async(req,res,next) =>{
    const driver_id = req.params.did;
    let history;
    try {
    history = await Booking_Schema.find({driver_id:driver_id});///////////////removed populate
  } catch (err) {
    const error = new Erur(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log(history);

  if (!history ) {
    return next(
      new Erur('Driver is introvert', 404)
    );
  }
  
  res.json({ logbook: history});
};
const avail_cabs = async(req,res,next) =>{
  const availability = true;
  let history;
  try {
  history = await Availability_Schema.find({availability:availability});///////////////removed populate
} catch (err) {
  const error = new Erur(
    'Fetching places failed, please try again later.',
    500
  );
  return next(error);
}

if (!history ) {
  return next(
    new Erur('Driver is introvert', 404)
  );
}

res.json({ logbook: history});
};
const end =  async(req,res,next) =>{
    const rider_id = req.params.uid;
    console.log(rider_id);
    let end_ride;
    try {
        end_ride = await Booking_Schema.findOne({rider_id:rider_id});///////////////removed populate
      } catch (err) {
        const error = new Erur(
          'Fetching places failed, please try again later.',
          500
        );
        return next(error);
      }
   ///   console.log(end_ride);
     end_ride.status =false;
      try {
        await end_ride.save();
       } catch (err) {
         const error = new Erur(
           'Updation up failed, please try again later.',
           500
         );
         return next(error);
       }
       res.status(201).json({message: 'Ride Ended'});


};
exports.booking = booking;
exports.availability = availability;
exports.update_location = update_location;
exports.history_uid = history_uid;
exports.history_did = history_did;
exports.end = end;
exports.avail_cabs = avail_cabs;