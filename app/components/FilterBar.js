"use client";

export default function FilterBar({ setFilter }) {

  return (
    <div style={{display:"flex", gap:10, marginBottom:20}}>

      <button onClick={()=>setFilter("all")}>All</button>
      <button onClick={()=>setFilter("pending")}>Not Started</button>
      <button onClick={()=>setFilter("completed")}>Completed</button>
      <button onClick={()=>setFilter("high")}>High Priority</button>

    </div>
  );
}
