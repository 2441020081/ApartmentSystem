<template>
    <div align="left">
        <Button type="primary" style="align:left;margin-bottom:15px;">维修申报</Button>
        <Table :columns="columns1" :data="data1"></Table>
    </div>
</template>
<script>
    let map = ['厕所','电器','门具','其他']
    export default {
        inject:['reload'],
        mounted () {
            this.$axios.get('http://localhost:3000/maintain/getAll').then(r=>{
                if(r.data.message === 'success'){
                    let data = r.data.data
                    data.forEach(o=>{
                        o.type = map[o.type]
                        o.status === 0?o.status='等待维修':o.status='维修完毕'
                    })
                    this.data1 = data
                }
            })
        },
        data () {
            return {
                columns1: [
                    {
                        title:'维修ID',
                        key:'id'
                    },
                    {
                        title: '楼号',
                        key: 'dorm_id'
                    },
                    {
                        title: '房间号',
                        key: 'name'
                    },
                    {
                        title: '维修类型',
                        key: 'type'
                    },
                    {
                        title:'维修内容',
                        key:'detail'
                    },
                    {
                        title:'维修状态',
                        key:'status'
                    },
                    {
                        title:'操作',
                        key:'op',
                        render: (h, params)=> {
                            return h('div',[
                                h('Button',{
                                    props:{
                                        type:'success',
                                        size:'small'
                                    },
                                    style:{
                                        marginRight:'10px'
                                    },
                                    on:{
                                        click:()=>{
                                            this.$axios.post('http://localhost:3000/maintain/changeStatus',{
                                                id:params.row.id
                                            }).then(r=>{
                                                if(r.data === 'success'){
                                                    this.$Message.success('修改维修状态成功')
                                                    this.reload()
                                                }
                                                else this.$Message.error('修改失败')
                                            })
                                        }
                                    }
                                },'修改状态')
                            ,h('Button',{
                                    props:{
                                        type:'error',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.$Modal.confirm({
                                                title:'删除确认',
                                                content:'<p>删除后不可恢复，确定要删除吗？</p>',
                                                onOk:()=>{
                                                    this.$axios.post('http://localhost:3000/maintain/delete',{
                                                        id:this.data1[params.index].id
                                                    }).then(r=>{
                                                        if(r.data === 'success'){
                                                            this.$Message.success('删除成功')
                                                            this.reload()
                                                        }
                                                    })
                                                },
                                            })
                                        }
                                    }
                                },'删除')])
                        }
                    }
                ],
                data1: []
            }
        }
    }
</script>
