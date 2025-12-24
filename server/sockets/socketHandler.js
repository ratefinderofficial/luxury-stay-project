module.exports = (io) => {
    
    io.on('connection', (socket) => {
        // 1. Get User Info
        const { userId, role } = socket.handshake.query;
        
        console.log(`🔌 Socket Connected: ${socket.id} | User: ${userId} | Role: ${role}`);

        // 2. Join Channels
        if (userId) socket.join(userId);

        if (role === 'Admin') {
            socket.join('admin_channel');
            socket.join('staff_channel');
        } 
        else if (['Manager', 'Receptionist'].includes(role)) {
            socket.join('staff_channel');
            socket.join('reception_channel');
        } 
        else if (role === 'Housekeeping') {
            socket.join('staff_channel');
            socket.join('housekeeping_channel');
        }

        // 3. Event Listeners
        socket.on('task_completed', (data) => {
            console.log(`🧹 Cleaning Finished: Room ${data.roomNumber}`);
            
            io.to('reception_channel').to('admin_channel').emit('notification', {
                title: 'Room Ready',
                message: `Room ${data.roomNumber} is clean.`,
                type: 'success',
                timestamp: new Date()
            });

            io.emit('room_status_update', {
                roomId: data.roomId,
                status: 'Available'
            });
        });

        socket.on('manual_status_change', (data) => {
            io.emit('room_status_update', {
                roomId: data.roomId,
                status: data.status
            });
        });

        socket.on('report_maintenance', (data) => {
            io.to('admin_channel').emit('notification', {
                title: 'Maintenance Alert',
                message: `Issue in Room ${data.roomNumber}: ${data.issue}`,
                type: 'error',
                timestamp: new Date()
            });
        });

        socket.on('disconnect', () => {
            // console.log(`❌ Socket Disconnected: ${socket.id}`);
        });
    });
};