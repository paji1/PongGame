
type INode  = {
    id : number,
    sockIds: string[]
    status: string,
    vertices: string[]
}
interface IAdjacencyList
{
    nodes: INode[]
    newNode(user:number,sockId :string, status:string)
    delNode(user:number,sockId:string) 
    addvertices(user:number , sockId: string)
    changeStatus(user:number, status:string)
}