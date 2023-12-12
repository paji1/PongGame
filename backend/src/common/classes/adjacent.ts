import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

export class AdjacencyList implements IAdjacencyList
{
    constructor()
    {
        this.nodes = new Array
    }
    nodes: INode[];
   
    newNode(user: number, sockId :string,status: string) {
        let node: INode = {
            id: user,
            sockIds: [sockId],
            status : status,
            vertices : []
        }
        let index = this.nodes.findIndex((ob : INode) => ob.id === user)
        if (index === -1)
            this.nodes.push(node)
        else
            this.nodes[index].sockIds.push(sockId)
    }

    delNode(user: number, sockId:string) {
        let index = this.nodes.findIndex((ob : INode) => ob.id === user)
        if (this.nodes[index].sockIds.length ===1)
            this.nodes = this.nodes.filter((ob: INode) => ob.id !== user);
        else
            this.nodes[index].sockIds = this.nodes[index].sockIds.filter((sock:string) => sock!==sockId)
    }
    addvertices(user: number, sockId: string) {
        var index = this.nodes.findIndex((ob:INode) => ob.id === user);
        this.nodes[index].vertices.push(sockId);
    }
    changeStatus(user:number, status:string)
    {
        let index = this.nodes.findIndex((ob : INode) => ob.id === user)
        this.nodes[index].status = status
    }
    Notify(user: number,server:Server)
    {
        const   inconsistence = [];
        let userdata = this.nodes.find((ob : INode) => ob.id === user)
        console.log(userdata)
        userdata.vertices.map(async (sockid:string, index: number) => {
            const client =  server.sockets.sockets.get(sockid)
            if (client === undefined)
                inconsistence.push(index)
            else
                client.emit("status",userdata.status)
        })
        console.log(inconsistence)
    }
    getstatus(user:number)
    {
        let userdata = this.nodes.find((ob : INode) => ob.id === user)
        if (userdata === undefined)
            return "offline";
        return userdata.status;
    }

}