const router = require('koa-router')()
const knex = require('../utils/knex')

router.prefix('/dorm')

router.get('/getAll',async(ctx,next)=>{
  let back = {
    message:'fail',
    data:[]
  }
  await knex('dorm').join('admin','dorm.admin_id','=','admin.id')
  .select('dorm.id as id','room','type','admin.id as adminid','name','gender','tel').then(e=>{
    if(e.length === 0){
      back.message = 'empty'
    }
    else{
      back.message = 'success'
      back.data = e
    }
  })
  ctx.body = back
})

router.post('/add',async(ctx,next)=>{
  let req = ctx.request.body // req: room, type, admin_id
  let back = 'fail'
  await knex('dorm').insert({
    room:req.room,
    type:req.type,
    admin_id:req.admin_id
  }).then(e=>{
    back = 'success'
  })
  ctx.body = back
})

router.post('/delete',async(ctx,next)=>{
  let req = ctx.request.body // req: id
  let back = 'fail'
  await knex('dorm').where('id',req.id).del().then(e=>{back = 'success'})
  ctx.body = back
})
module.exports = router
