
# CampusPulse: A Unified Hostel & Campus Management System

Welcome to CampusPulse, the all-in-one solution for modern campus and hostel management. This application is designed to streamline administrative tasks, enhance student services, and improve security operations within a university environment. Built with a modern tech stack, CampusPulse provides dedicated dashboards and features for administrators, students, and security personnel.

## Key Features

CampusPulse offers a comprehensive suite of features tailored to the needs of its diverse users:

### For Administrators:
- **Centralized Dashboard**: Get a real-time overview of campus activities, including student population, room occupancy, pending outpasses, and active complaints.
- **Student & Room Management**: Easily manage student records and track hostel room allocation and availability.
- **Outpass & Complaint Oversight**: Monitor and manage all student outpass requests and complaints from a single interface.
- **Fee Management**: Track hostel fee payments and statuses for all students.
- **Announcements**: Broadcast important notices and updates to the entire campus community.
- **AI-Powered Feedback Analysis**: Utilize Genkit-powered AI to analyze anonymous student feedback and identify key trends and actionable insights.

### For Students:
- **Personalized Dashboard**: Access a personal hub to manage outpasses, fees, and complaints.
- **Digital Outpass System**: Request, track, and manage outpasses digitally, eliminating paperwork.
- **Fee Transparency**: Check hostel fee status and payment history.
- **Complaint & Feedback Submission**: Easily lodge complaints regarding hostel or college facilities and provide anonymous feedback to help improve the campus experience.

### For Security Personnel:
- **Security Desk**: A dedicated interface for managing campus entry and exit.
- **Outpass Verification**: Quickly verify the authenticity of student outpasses using their unique ID.
- **Entry/Exit Logging**: Manually or automatically log student entries and exits to maintain a secure campus environment.

## Technology Stack

This project is built using a powerful and modern technology stack:

- **Frontend**: [Next.js](https://nextjs.org/) (with App Router) & [React](https://react.dev/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation & Running the App

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sandycodes-1502/campuspulse.git
   ```
2. **Install NPM packages:**
   ```sh
   npm install
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Agile Development Workflow

This project follows an Agile methodology, specifically inspired by the Scrum framework, to ensure iterative development, flexibility, and continuous improvement.

### Our Workflow

1.  **Product Backlog**: All desired features, enhancements, and bug fixes are maintained in a prioritized list called the Product Backlog. Each item is a "User Story" (e.g., "As a student, I want to request an outpass so that I can get permission to leave campus.").

2.  **Sprints**: Development is organized into fixed-length iterations called Sprints (typically 1-2 weeks). At the start of each sprint, the team selects a number of high-priority items from the Product Backlog to work on. This becomes the Sprint Backlog.

3.  **Daily Stand-ups**: Each day, the development team holds a brief meeting to sync up on progress. Each member answers three questions:
    - What did I do yesterday?
    - What will I do today?
    - Are there any impediments in my way?

4.  **Development**: The team works on the user stories in the Sprint Backlog. In Firebase Studio, this involves conversational AI-driven development, where requirements are translated into code changes by the AI partner.

5.  **Sprint Review**: At the end of the sprint, the team demonstrates the completed work to stakeholders. This is an opportunity to gather feedback, which can be incorporated into the Product Backlog for future sprints.

6.  **Sprint Retrospective**: After the review, the team meets to reflect on the sprint process itself. The goal is to identify what went well, what could be improved, and to create an action plan for making those improvements in the next sprint.

This iterative cycle allows us to deliver value quickly, adapt to changing requirements, and ensure the final product aligns closely with user needs.
