import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface CrowdVibeHeatmapProps {
  progress: number;
  actId: string;
}

export default function CrowdVibeHeatmap({ progress, actId }: CrowdVibeHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ time: number; hits: number }[]>([]);

  // Generate mock data for the current act
  useEffect(() => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      time: i,
      // Random baseline plus some clustered peaks representing jokes hitting
      hits: Math.random() * 0.3 + (Math.random() > 0.8 ? Math.random() * 0.7 : 0) 
    }));
    
    // Smooth the data slightly to make it look like a real heatmap
    const smoothed = mockData.map((d, i, arr) => {
      const prev = arr[Math.max(0, i - 1)]?.hits || d.hits;
      const next = arr[Math.min(arr.length - 1, i + 1)]?.hits || d.hits;
      return { time: d.time, hits: (d.hits + prev + next) / 3 };
    });

    setData(smoothed);
  }, [actId]);

  // Draw D3 Heatmap
  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = 40;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block');

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    // Color scale: from transparent dark to orange to bright green
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 0.4, 1])
      .range(['rgba(0,0,0,0)', '#ea580c', '#22c55e']);

    // Draw the heatmap rects
    const rectWidth = width / 100;
    
    svg.selectAll('rect.heatmap-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-bar')
      .attr('x', (d: any) => xScale(d.time))
      .attr('y', 0)
      .attr('width', rectWidth + 0.5) // +0.5 to prevent sub-pixel gaps
      .attr('height', height)
      .attr('fill', (d: any) => colorScale(d.hits))
      .attr('opacity', 0.8);

    // Current progress marker
    svg.append('rect')
      .attr('id', 'progress-marker')
      .attr('x', xScale(Math.min(100, Math.max(0, progress))))
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', height)
      .attr('fill', '#ffffff')
      .attr('opacity', 0.9);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        svg.attr('width', newWidth);
        xScale.range([0, newWidth]);
        const newRectWidth = newWidth / 100;
        
        svg.selectAll('rect.heatmap-bar')
          .attr('x', (d: any) => xScale(d.time))
          .attr('width', newRectWidth + 0.5);
          
        svg.select('#progress-marker')
          .attr('x', xScale(Math.min(100, Math.max(0, progress))));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  // Update progress marker efficiently without re-rendering everything
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    d3.select(containerRef.current).select('#progress-marker')
      .attr('x', xScale(Math.min(100, Math.max(0, progress))));
  }, [progress]);

  return (
    <div className="w-full relative mb-4">
      <div className="absolute -top-5 left-0 text-[10px] font-mono text-green-500 uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Crowd Vibe / Bong Hit Density
      </div>
      <div ref={containerRef} className="w-full h-[40px] bg-black/60 rounded overflow-hidden backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]"></div>
    </div>
  );
}
