import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  LogOut, 
  LogIn, 
  AlertTriangle,
  Brush, // Changed from Broom to Brush
  CheckCircle
} from 'lucide-react';

// Hooks & Context
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket'; // Real-time updates

// Components
import PageHeader from '../../components/Layout/PageHeader';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';

const StaffDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  // Mock Operational Data (In real app, fetch from dashboardAPI)
  const [opsData, setOpsData] = useState({
    arrivals: 12,
    departures: 8,
    cleaningPending: 5,
    maintenanceIssues: 2,
    todayTasks: [
      { id: 1, task: 'Clean Room 101', priority: 'High', status: 'Pending' },
      { id: 2, task: 'Deliver towels to Room 204', priority: 'Medium', status: 'Completed' },
      { id: 3, task: 'Check AC in Lobby', priority: 'Low', status: 'Pending' },
    ]
  });

  // Requirement: Real-time updates via Socket
  useEffect(() => {
    if (!socket) return;

    socket.on('task_updated', (newTask) => {
      // Update local state logic
      console.log('New task update received:', newTask);
      // Example: Refresh data here
    });

    return () => socket.off('task_updated');
  }, [socket]);

  // Helper for Task Card
  const ActionCard = ({ title, count, icon: Icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
    >
      <div className={`p-4 rounded-full ${color} text-white group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
        <p className="text-gray-500 font-medium text-sm">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      {/* 1. Personalized Header */}
      <PageHeader 
        title={`Hello, ${user?.name?.split(' ')[0] || 'Staff'}! 👋`} 
        subtitle="Here is your operational overview for today."
      />

      {/* 2. Operational Metrics (Clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard 
          title="Arrivals Today" 
          count={opsData.arrivals} 
          icon={LogIn} 
          color="bg-blue-500"
          onClick={() => navigate('/bookings/check-in-out')}
        />
        <ActionCard 
          title="Departures Today" 
          count={opsData.departures} 
          icon={LogOut} 
          color="bg-gray-700"
          onClick={() => navigate('/bookings/check-in-out')}
        />
        <ActionCard 
          title="Cleaning Tasks" 
          count={opsData.cleaningPending} 
          icon={Brush} 
          color="bg-orange-500"
          onClick={() => navigate('/housekeeping')}
        />
        <ActionCard 
          title="Maintenance Issues" 
          count={opsData.maintenanceIssues} 
          icon={AlertTriangle} 
          color="bg-red-500"
          onClick={() => navigate('/maintenance')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. My Tasks List (Requirement: Housekeeping/Task Management) */}
        <div className="lg:col-span-2">
          <Card 
            title="My Pending Tasks" 
            action={<Button size="sm" variant="outline">View All</Button>}
          >
            <div className="space-y-1">
              {opsData.todayTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className={`font-medium ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.task}
                      </p>
                      <span className="text-xs text-gray-500">Assigned by Manager</span>
                    </div>
                  </div>
                  <div>
                    {task.status === 'Completed' ? (
                      <Badge type="success"><CheckCircle size={12} className="mr-1"/> Done</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs h-8">Mark Done</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 4. Quick Actions Panel */}
        <div className="lg:col-span-1">
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="primary" 
                className="w-full justify-start"
                onClick={() => navigate('/bookings/new')}
              >
                <ClipboardList size={18} className="mr-2"/> New Reservation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/maintenance')}
              >
                <AlertTriangle size={18} className="mr-2"/> Report Issue
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/rooms')}
              >
                <CheckCircle size={18} className="mr-2"/> Check Room Status
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-bold text-primary text-sm mb-1">Shift Note</h4>
              <p className="text-xs text-blue-800">
                Large group checking in at 4:00 PM today. Please ensure all deluxe suites are inspected by 3:00 PM.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;