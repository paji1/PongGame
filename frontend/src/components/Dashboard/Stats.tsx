import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Stats(){
	const data = [
		{
		  name: 'JANUARY',
		  ' WINS ' : 15,
		  ' LOSSES ': 33,
		  ' DRAWS ': 62,
		},
		{
		  name: 'FEBRUARY',
		  ' WINS ' : 35,
		  ' LOSSES ': 12,
		  ' DRAWS ': 46,
		},
		{
		  name: 'MARCH',
		  ' WINS ' : 75,
		  ' LOSSES ': 37,
		  ' DRAWS ': 25,
		},
		{
		  name: 'APRIL',
		 ' WINS ' : 25,
		  ' LOSSES ': 11,
		  ' DRAWS ': 8,
		},
		{
		  name: 'MAY',
		 ' WINS ' : 31,
		  ' LOSSES ': 14,
		  ' DRAWS ': 8,
		},
		{
		  name: 'JUNE',
		  ' WINS ' : 53,
		  ' LOSSES ': 10,
		  ' DRAWS ': 17,
		},
		{
		  name: 'JULY',
		  ' WINS ' : 50,
		  ' LOSSES ': 33,
		  ' DRAWS ': 22,
		},
		{
		  name: 'AUGUST',
		  ' WINS ' : 39,
		  ' LOSSES ': 13,
		  ' DRAWS ': 6,
		},
		{
		  name: 'SEPTEMBER',
		  ' WINS ' : 16,
		  ' LOSSES ': 5,
		  ' DRAWS ': 4,
		},
		{
		  name: 'OCTOBER',
		  ' WINS ' : 72,
		  ' LOSSES ': 21,
		  ' DRAWS ': 11,
		},
		{
		  name: 'NOVEMBER',
		 ' WINS ' : 89,
		  ' LOSSES ': 35,
		  ' DRAWS ': 14,
		},
		{
		  name: 'DECEMBER',
		  ' WINS ' : 7,
		  ' LOSSES ': 3,
		  ' DRAWS ': 2,
		}
	];
	return (
		<div className="min-[0px]:mx-5 2xl:m-auto flex flex-col justify-center border-solid border-4 h-[850px] border-black max-w-[1536px] shadow-[2px_4px_0px_0px_#000301] p-20 pt-20 Ft gap-y-12">
				<h1 className='text-center min-[0px]:text-xl xl:text-2xl text-3xl font-Nova font-bold ring-black ring-4 min-[0px]:mx-5 2xl:m-auto p-6 w-full -mt-8'>PONG STATS</h1>
				<div className='ring-black ring-4 min-[0px]:pr-8 min-[0px]:pl-0 2xl:pr-24 2xl:p-14 h-full min-[0px]:mx-5 2xl:m-auto w-full p-12'>
					<ResponsiveContainer >
						<LineChart 
						data={data}
						>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="name" type="category" width={4} padding="gap"/>
							<YAxis type="number"/>
							<Tooltip />
							<Legend iconType='rect' iconSize={15} height={8}/>
							<Line dataKey=" WINS " stroke="#24BEC8" strokeWidth={5}/>
							<Line dataKey=" LOSSES " stroke="#F18DB3"strokeWidth={5}/>
							<Line dataKey=" DRAWS " stroke="#0076C0"strokeWidth={5}/>
						</LineChart >
					</ResponsiveContainer>
				</div>
		</div>
	);
}
