import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

export class List implements IList {
	constructor() {
		this.nodes = new Map<string, string[]>
	}
	nodes
	newNode(node:string)
	{
		if (!this.nodes.has(node))
		{
			this.nodes.set(node, [])
			console.log("new node", this.nodes)
		}
		else
			console.log("dejakayna")
	}
	addedge(node:string, edge:string)
	{
		if (!this.nodes.has(node))
		{
			this.nodes.set(node, [])
		}
		if(!this.nodes.get(node).includes(edge))
			this.nodes.get(node).push(edge)
	}
	getedges(node:string)
	{
		if (!this.nodes.has(node))
		{
			this.nodes.set(node, [])
		}
		return this.nodes.get(node);
	}
}
