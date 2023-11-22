import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";


const SimplePieCharts = ({data, COLORS}) => {
    return (
        <div style={{width:'100%', height:500}}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data}
                    dataKey="value" 
                    cx="50%" cy="50%" 
                    outerRadius={100} 
                    innerRadius={40}
                    fill="#8884d8" label
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>    
        </div>
    );
};

export default SimplePieCharts;