import './style.css'

const projects = [
  {
    title: 'Algorithms',
    description: 'Visualizing sorting algorithms like Insertion, Bubble, and Quick Sort.',
    link: './projects/sorting-algorithms/algorithms.html'
  },
  {
    title: 'Data Structures',
    description: 'Visualizing Arrays, Linked Lists, Trees, Graphs, and more.',
    link: './projects/data-structures/data-structures.html'
  },
  {
    title: 'Graph Algorithms',
    description: 'Visualizing Max Flow and other graph problems.',
    link: './projects/graph-algorithms/graph-algorithms.html'
  },
  {
    title: 'Signal Processing',
    description: 'Real-time audio visualization and tone generation.',
    link: './projects/signal-processing/signal-processing.html'
  },
  {
    title: 'Network Structure',
    description: 'Visualizing Physical/Logical layouts, OSI Model, and Protocols.',
    link: './projects/network-topologies/network-topologies.html'
  },
];

const projectsContainer = document.querySelector('#projects');

function renderProjects() {
  if (!projectsContainer) return;

  projectsContainer.innerHTML = projects.map(project => `
    <a href="${project.link}" class="project-card" style="text-decoration: none; color: inherit; display: block;">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    </a>
  `).join('');
}

renderProjects();
