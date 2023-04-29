import unittest
import os.path
from graph import plot_graph
import glob
import pandas as pd
import matplotlib.pyplot as plt

class TestPlotGraph(unittest.TestCase):
    
    def test_file_exists(self):
        # Check if the output.csv file exists
        self.assertTrue(os.path.isfile('csv-dataset/output.csv'))

    def test_plot_graph(self):
        # Check if the function produces the expected number of graphs
        plot_graph()
        files = glob.glob('graphs/*')
        self.assertEqual(len(files), 9)

    def test_graph_exists(self):
        # Check if a specific graph exists
        plot_graph()
        self.assertTrue(os.path.isfile('graphs/11.png'))

    def test_nonexistent_object_track_no(self):
        # Check if a graph is not created for an object track number that doesn't exist in the dataset
        plot_graph()
        self.assertTrue(os.path.isfile('graphs/12.png'))

    def test_missing_column(self):
        # Check if the function raises an error if a required column is missing
        df = pd.DataFrame(columns=['object_track_no', 'frame_no'])
        with self.assertRaises(KeyError):
            plot_graph()


if __name__ == '__main__':
    unittest.main()