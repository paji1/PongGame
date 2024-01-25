import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../Context/SocketContext"
import Lottie from "lottie-web"
import { toast } from "react-toastify"

const QueueLoader = () => {
	const loading_container = useRef<HTMLDivElement>(null)

	const socket = useContext(SocketContext)

	useEffect(() => {

		if (loading_container.current)
		{
			Lottie.loadAnimation({
				container: loading_container.current,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				animationData: require('../../assets/Loading.json')
			})
		}

		const cleanup = () => {
			socket.emit('leave_queue', {});
			socket.off('enter_queue');
		  };
		
		  window.addEventListener('beforeunload', cleanup);
		
		  return () => {
			window.removeEventListener('beforeunload', cleanup);
			cleanup()
		  };

	}, [])

	return (
		<div ref={loading_container} className={`container overflow-hidden w-full h-full bg-DefaultColor`}></div>
	)
}

export default QueueLoader