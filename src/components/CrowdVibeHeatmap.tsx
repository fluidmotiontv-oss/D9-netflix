import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SessionTimelineEvent } from '../utils/sessionLog';
import { Flame, Sparkles, AlertCircle, Info } from 'lucide-react';

interface CrowdVibeHeatmapProps {
  progress: number;
  actId: string;
  timeline: SessionTimelineEvent[];
}

export default function CrowdVibeHeatmap({ progress, actId, timeline }: CrowdVibeHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [binsData, setBinsData] = useState<any[]>([]);
  const [hoverEvent, setHoverEvent] = useState<{
    x: number;
    y: number;
    title: string;
    desc: string;
    type: string;
    sentiment?: string;
  } | null>(null);

  // Process the Session Timeline events into 100 Heatmap Bins via Gaussian KDE
  useEffect(() => {
    // Filter events of the current act
    const actEvents = timeline.filter((evt) => {
      if (evt.metadata?.actId === actId) return true;
      // Fallback for general crowd/heckle events
      if (evt.type === 'crowd_reaction' || evt.type === 'heckle' || evt.type === 'roast') {
        return !evt.metadata?.actId; // include legacy / unassigned events
      }
      return false;
    });

    // Initialize 100 timeline bins with deterministic pleasant baseline wave
    const processedBins = Array.from({ length: 100 }, (_, i) => {
      const angle = (i / 100) * Math.PI * 4;
      const baseVal = 0.05 + 0.06 * Math.sin(angle) + 0.04 * Math.cos(angle * 2.5);
      return {
        time: i,
        positive: baseVal,
        negative: 0.02,
        total: baseVal + 0.02,
        events: [] as SessionTimelineEvent[],
      };
    });

    // Apply Gaussian Spread for each active performance event
    actEvents.forEach((evt) => {
      let p = evt.metadata?.progress;
      if (typeof p !== 'number') {
        // Fallback: map chronologically if progress is missing
        const firstTime = actEvents[0]?.timestamp || Date.now() - 30000;
        const lastTime = Date.now();
        const timeSpan = lastTime - firstTime || 1;
        p = ((evt.timestamp - firstTime) / timeSpan) * 100;
      }

      const center = Math.round(Math.min(99, Math.max(0, p)));
      
      // Determine event weight
      let weight = 0.25;
      if (evt.type === 'heckle') {
        weight = evt.metadata?.isBrutal ? 0.7 : 0.4;
      } else if (evt.type === 'crowd_reaction') {
        const intensity = evt.metadata?.intensity;
        if (intensity === 'epic') weight = 0.75;
        else if (intensity === 'high') weight = 0.5;
        else if (intensity === 'medium') weight = 0.3;
      } else if (evt.type === 'roast') {
        weight = 0.65;
      }

      const isPositive = evt.sentiment === 'positive';
      const isNegative = evt.sentiment === 'negative';

      // Distribute weights with standard deviation sigma = 2.2 bins
      const sigma = 2.2;
      for (let offset = -5; offset <= 5; offset++) {
        const binIdx = center + offset;
        if (binIdx >= 0 && binIdx < 100) {
          const dist = Math.abs(offset);
          const gauss = Math.exp(-(dist * dist) / (2 * sigma * sigma));
          const addedVal = weight * gauss;

          if (isPositive) {
            processedBins[binIdx].positive += addedVal * 1.5;
          } else if (isNegative) {
            processedBins[binIdx].negative += addedVal * 1.5;
          } else {
            processedBins[binIdx].positive += addedVal * 0.4;
            processedBins[binIdx].negative += addedVal * 0.4;
          }

          processedBins[binIdx].total += addedVal;
          
          // Only add unique events to bin list
          if (!processedBins[binIdx].events.some((e) => e.id === evt.id)) {
            processedBins[binIdx].events.push(evt);
          }
        }
      }
    });

    setBinsData(processedBins);
  }, [timeline, actId]);

  // Render Heatmap with D3.js
  useEffect(() => {
    if (!containerRef.current || binsData.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = 40;

    // Clear previous SVG contents
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block')
      .style('overflow', 'visible');

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    // Render the Heatmap Rectangles
    const rectWidth = width / 100;

    svg.selectAll('rect.heatmap-cell')
      .data(binsData)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', (d: any) => xScale(d.time))
      .attr('y', 0)
      .attr('width', rectWidth + 0.5) // Prevent sub-pixel cracks
      .attr('height', height)
      .attr('fill', (d: any) => {
        // Blend positive & negative intensities dynamically
        if (d.total < 0.08) {
          return `rgba(30, 41, 59, ${0.15 + d.total * 1.5})`; // low activity cool gray/blue
        }
        const totalWeight = d.positive + d.negative || 1;
        const posRatio = d.positive / totalWeight;
        const negRatio = d.negative / totalWeight;

        // Custom mathematical RGB blending for high contrast heat representation
        const r = Math.round(posRatio * 16 + negRatio * 239);
        const g = Math.round(posRatio * 185 + negRatio * 68);
        const b = Math.round(posRatio * 129 + negRatio * 68);
        const opacity = Math.min(0.95, 0.35 + d.total * 1.2);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      })
      .attr('cursor', (d: any) => (d.events.length > 0 ? 'pointer' : 'default'))
      .style('transition', 'fill 0.2s ease')
      .on('mouseover', function (event: any, d: any) {
        if (d.events && d.events.length > 0) {
          // Select most recent/prominent event in this bin
          const topEvent = d.events[d.events.length - 1];
          const bounds = event.currentTarget.getBoundingClientRect();
          const parentBounds = containerRef.current?.getBoundingClientRect();

          d3.select(this)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5)
            .attr('y', -2)
            .attr('height', height + 4);

          setHoverEvent({
            x: bounds.left - (parentBounds?.left || 0) + bounds.width / 2,
            y: -12,
            title: topEvent.label,
            desc: topEvent.details || topEvent.timeFormatted,
            type: topEvent.type,
            sentiment: topEvent.sentiment,
          });
        }
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke', 'none')
          .attr('y', 0)
          .attr('height', height);
        setHoverEvent(null);
      });

    // Draw White Horizontal Timeline Axis Grid Line
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', height - 1)
      .attr('x2', width)
      .attr('y2', height - 1)
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 1);

    // Current Performance Progress Needle Marker
    svg.append('line')
      .attr('id', 'progress-needle')
      .attr('x1', xScale(Math.min(100, Math.max(0, progress))))
      .attr('y1', -4)
      .attr('x2', xScale(Math.min(100, Math.max(0, progress))))
      .attr('y2', height + 4)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0px 0px 4px rgba(255,255,255,0.8))');

    // Handle Window Resize dynamically
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        svg.attr('width', newWidth);
        xScale.range([0, newWidth]);
        const newRectWidth = newWidth / 100;

        svg.selectAll('rect.heatmap-cell')
          .attr('x', (d: any) => xScale(d.time))
          .attr('width', newRectWidth + 0.5);

        svg.select('#progress-needle')
          .attr('x1', xScale(Math.min(100, Math.max(0, progress))))
          .attr('x2', xScale(Math.min(100, Math.max(0, progress))));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [binsData]);

  // Update progress needle efficiently on progress ticks without rebuilding entire canvas
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    
    d3.select(containerRef.current).select('#progress-needle')
      .attr('x1', xScale(Math.min(100, Math.max(0, progress))))
      .attr('x2', xScale(Math.min(100, Math.max(0, progress))));
  }, [progress]);

  return (
    <div className="w-full relative my-5 select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1.5 font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Crowd Engagement Heatmap (D3.js)
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono text-white/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
            Laughter/Applause
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-500"></span>
            Heckle/Disruption
          </span>
        </div>
      </div>

      <div className="relative">
        {/* The D3 Canvas container */}
        <div 
          ref={containerRef} 
          className="w-full h-[40px] bg-slate-950 rounded-lg overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.06)] relative"
        ></div>

        {/* Floating Tooltip displaying exact timeline event details */}
        {hoverEvent && (
          <div 
            className="absolute z-50 pointer-events-none p-2.5 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-md shadow-2xl transition-all duration-150 flex flex-col gap-1 text-[10px] font-mono w-[180px]"
            style={{
              left: `${Math.min(containerRef.current?.clientWidth || 200, Math.max(0, hoverEvent.x - 90))}px`,
              top: `${hoverEvent.y - 68}px`
            }}
          >
            <div className="flex items-center gap-1 justify-between">
              <span className={`font-black uppercase text-[9px] px-1.5 py-0.5 rounded ${
                hoverEvent.sentiment === 'positive' 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : hoverEvent.sentiment === 'negative'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-white/10 text-white/70'
              }`}>
                {hoverEvent.type.replace('_', ' ')}
              </span>
              <span className="text-[8px] text-white/40">Timeline Event</span>
            </div>
            <div className="text-white/90 font-bold truncate">{hoverEvent.title}</div>
            <div className="text-white/50 text-[9px] leading-snug break-words line-clamp-2">{hoverEvent.desc}</div>
            
            {/* Tiny arrow tail */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-white/10 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}
