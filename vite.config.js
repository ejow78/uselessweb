import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                projects: resolve(__dirname, 'projects.html'),
                journal: resolve(__dirname, 'journal.html'),
                resume: resolve(__dirname, 'resume.html'),
                // Sorting Algorithms
                algorithms: resolve(__dirname, 'projects/sorting-algorithms/algorithms.html'),
                bubbleSort: resolve(__dirname, 'projects/sorting-algorithms/bubble-sort/bubble-sort.html'),
                insertionSort: resolve(__dirname, 'projects/sorting-algorithms/insertion-sort/insertion-sort.html'),
                selectionSort: resolve(__dirname, 'projects/sorting-algorithms/selection-sort/selection-sort.html'),
                quickSort: resolve(__dirname, 'projects/sorting-algorithms/quick-sort/quick-sort.html'),
                mergeSort: resolve(__dirname, 'projects/sorting-algorithms/merge-sort/merge-sort.html'),
                shakerSort: resolve(__dirname, 'projects/sorting-algorithms/shaker-sort/shaker-sort.html'),
                // Data Structures
                dataStructures: resolve(__dirname, 'projects/data-structures/data-structures.html'),
                arrays: resolve(__dirname, 'projects/data-structures/arrays/arrays.html'),
                linkedLists: resolve(__dirname, 'projects/data-structures/linked-lists/linked-lists.html'),
                stacks: resolve(__dirname, 'projects/data-structures/stacks/stacks.html'),
                queues: resolve(__dirname, 'projects/data-structures/queues/queues.html'),
                trees: resolve(__dirname, 'projects/data-structures/trees/trees.html'),
                graphs: resolve(__dirname, 'projects/data-structures/graphs/graphs.html'),
                hashTables: resolve(__dirname, 'projects/data-structures/hash-tables/hash-tables.html'),
                tries: resolve(__dirname, 'projects/data-structures/tries/tries.html'),
                // Graph Algorithms
                graphAlgorithms: resolve(__dirname, 'projects/graph-algorithms/graph-algorithms.html'),
                maxFlow: resolve(__dirname, 'projects/graph-algorithms/max-flow/max-flow.html'),
                dijkstra: resolve(__dirname, 'projects/graph-algorithms/dijkstra/dijkstra.html'),
                prim: resolve(__dirname, 'projects/graph-algorithms/prim/prim.html'),
                // Signal Processing
                signalProcessing: resolve(__dirname, 'projects/signal-processing/signal-processing.html'),
                toneVisualizer: resolve(__dirname, 'projects/signal-processing/tone-visualizer/tone-visualizer.html'),
                fourier: resolve(__dirname, 'projects/signal-processing/fourier/fourier.html'),
                amFm: resolve(__dirname, 'projects/signal-processing/am-fm/am-fm.html'),
                // Network Topologies
                networkTopologies: resolve(__dirname, 'projects/network-topologies/network-topologies.html'),
                physical: resolve(__dirname, 'projects/network-topologies/physical/physical.html'),
                logical: resolve(__dirname, 'projects/network-topologies/logical/logical.html'),
            },
        },
    },
})
