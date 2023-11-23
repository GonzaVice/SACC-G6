import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";

const SimpleBarCharts = ({data}) => {
    return (
        <ResponsiveContainer width="100%" aspect={2}>
            <BarChart width={600} height={300} data={data} margin={{top:5, right:30, left:20, bottom:5}}>
                <CartesianGrid strokeDasharray="4 1" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="age" fill="#8884d8" />
                <Bar dataKey="weight" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SimpleBarCharts;