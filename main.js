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
    title: 'Network Topologies',
    description: 'Visualizing Physical and Logical network layouts.',
    link: './projects/network-topologies/network-topologies.html'
  },
  {
    title: 'F1 Data Analysis',
    description: 'Historical analysis of F1 rivalries (2021) and future prospects.',
    link: './projects/data-analysis/f1-rivalry'
  }
];

const projectsContainer = document.querySelector('#projects');
const featureContainer = document.querySelector('#ascii-feature');

function animateFeature() {
  if (!featureContainer) return;

  const frames = ['◰', '◳', '◲', '◱'];
  let i = 0;

  setInterval(() => {
    featureContainer.innerText = frames[i];
    i = (i + 1) % frames.length;
  }, 200);
}

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
animateFeature();
