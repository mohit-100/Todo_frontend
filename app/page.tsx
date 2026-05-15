// import Navbar from '@/components/Navbar';
// import TodoApp from '@/components/TodoApp';

import Navbar from "@/components/Navbar";
 import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main>
         <TodoApp /> 
      </main>
    </div>
  );
}