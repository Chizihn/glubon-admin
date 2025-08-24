// "use client";

// import { useState } from "react";
// import { Badge } from "../../../components/ui/badge";
// import { Button } from "../../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { MessageSquare, Users, AlertTriangle, Send, Plus } from "lucide-react";

// export default function CommunicationsPage() {
//   const [currentPage, setCurrentPage] = useState(1);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
//           <p className="text-gray-600">
//             Manage conversations, support tickets, and messaging
//           </p>
//         </div>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Send Announcement
//         </Button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Conversations</p>
//                 <p className="text-2xl font-bold">1,234</p>
//               </div>
//               <MessageSquare className="h-8 w-8 text-blue-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Support Tickets</p>
//                 <p className="text-2xl font-bold">45</p>
//                 <p className="text-xs text-yellow-600">12 pending</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-yellow-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Messages Today</p>
//                 <p className="text-2xl font-bold">2,456</p>
//               </div>
//               <Send className="h-8 w-8 text-green-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Flagged Content</p>
//                 <p className="text-2xl font-bold">8</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-red-500" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="text-center py-12">
//         <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-sm font-medium text-gray-900">
//           Communications Dashboard
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Detailed communication tools will be implemented here
//         </p>
//       </div>
//     </div>
//   );
// }
