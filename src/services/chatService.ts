import { api } from '../api/client';
import type { ChatMessage } from '../types';

export const chatService = {
  sendMessage: async (text: string, conversationHistory: ChatMessage[]): Promise<ChatMessage> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post('/api/chat', { message: text, history: conversationHistory });
      return response.data;
    }
    
    // Simulate AI response logic
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const query = text.toLowerCase();
    let responseText = "";
    let suggestions: string[] = [];

    if (query.includes('critical') || query.includes('danger') || query.includes('severity')) {
      responseText = "Based on current sensor data and citizen reports, there are **2 critical infrastructure points** that require immediate attention:\n\n1. **Brooklyn Bridge Eastern Span (AST-101)** - Concrete spalling and rebar corrosion. Structural Integrity health score: **48%**. Status: *Critical Repair Required*.\n2. **Times Square Water Pipe (ISS-9015)** - Water main burst causing active street flooding. Status: *Repairing*.\n\nWould you like me to open the Live City Map or inspect the Brooklyn Bridge asset details?";
      suggestions = ["Open Live City Map", "View Brooklyn Bridge Asset"];
    } else if (query.includes('pending') || query.includes('repairs') || query.includes('backlog')) {
      responseText = "Currently, there are **84 pending repairs** across all municipal departments. The breakdown is as follows:\n\n- **Road Damage / Potholes**: 32 pending repairs\n- **Water Grid Leaks**: 26 pending repairs\n- **Electrical / Streetlights**: 18 pending repairs\n- **Bridge Integrity**: 8 pending repairs\n\n**3 High-Priority work orders** are currently awaiting engineer assignment. Would you like to view the Kanban Board to assign them?";
      suggestions = ["Go to Kanban Board", "Assign Engineers"];
    } else if (query.includes('monthly') || query.includes('report') || query.includes('generate')) {
      responseText = "I've compiled the **Monthly Infrastructure Status Report (July 2026)**. Here is a summary of the metrics:\n\n- **Total Incidents Logged**: 185\n- **Successful Resolutions**: 155\n- **Estimated Cost Savings via AI Pre-Screening**: **$54,000**\n- **Critical Risk Failures Averted**: 4\n\nI have generated a downloadable PDF report for you. Click the download button below.";
      suggestions = ["Download PDF Report", "View Analytics Dashboard"];
    } else if (query.includes('engineer') || query.includes('availability') || query.includes('active')) {
      responseText = "Here is the status of our **5 active civil engineering leads**:\n\n- **David Lee** (Roadways): *Available* (0 tasks)\n- **Dr. Aris Thorne** (Bridges): *On Assignment* (2 active tasks, Brooklyn Bridge)\n- **Sarah Connor** (Water Lines): *On Assignment* (1 active task, Times Square)\n- **Michael Chang** (Electrical): *Available* (1 active task)\n- **Elena Rostova** (Sewerage): *On Leave*\n\nWould you like to schedule an emergency inspection with David Lee?";
      suggestions = ["Schedule Inspection", "View Scheduler Calendar"];
    } else if (query.includes('health') || query.includes('score') || query.includes('infrastructure')) {
      responseText = "The overall **City Infrastructure Health Score is 82.3%**, which is in the *Stable* range. Here is the category breakdown:\n\n- **Traffic signals & lighting**: **92%** (Optimal)\n- **Drainage & Sewers**: **88%** (Optimal)\n- **Road networks**: **79%** (Moderate Risk)\n- **Bridge systems**: **48%** (Critical Alert)\n\nWe need to focus resources on bridge systems to improve this quarter's score. Would you like to see a comparison chart?";
      suggestions = ["Show Department Comparison", "Review Asset Register"];
    } else {
      responseText = "Hello! I am the **InfraSense AI Assistant**. I can help you monitor municipal assets and manage active repair work. You can ask me to:\n\n- *'Show critical areas'*\n- *'Find pending repairs'*\n- *'Generate monthly status report'*\n- *'Check engineer availability'*\n- *'Summarize city infrastructure health'*";
      suggestions = ["Show critical areas", "Find pending repairs", "Infrastructure health"];
    }

    return {
      id: `chat-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toISOString(),
      suggestions
    };
  }
};
