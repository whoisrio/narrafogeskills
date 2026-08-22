import React from 'react';
import {GraphScene} from '../../../components/modern-tech/graph/GraphScene';
import {GraphNode} from '../../../components/modern-tech/graph/Node';
import {GraphEdge} from '../../../components/modern-tech/graph/Edge';
import {TokenFlow} from '../../../components/modern-tech/graph/TokenFlow';
import {PatternTitle} from '../../../components/modern-tech/graph/PatternTitle';
import {C, PATTERN_COLORS} from '../../../components/modern-tech/theme';

// e2e 示例 · Agent Loop 模式(模板 2 架构拓扑 + 模板 3 数据流):
// PatternTitle 揭晓模式 -> 节点按拓扑依次入场 -> 一个 token 跑完一圈循环
// (START -> model -> tools -> model 回流 -> END),展示 GraphNode/Edge/TokenFlow 编排。
// 注意:GraphEdge/TokenFlow 是 SVG 元素,必须放进 GraphScene 的 svgChildren prop
// (SVG 图层),不能当 children(HTML 图层),否则不渲染。
export const AGENT_LOOP_DURATION = 200;

// 节点坐标(共享给 edge/token 的起止点)
const N = {
  start: {x: 240, y: 540},
  model: {x: 760, y: 540},
  tools: {x: 1380, y: 540},
  end: {x: 760, y: 820},
};

export const AgentLoop: React.FC = () => {
  const frame = 0; // 占位;实际时序由各组件 appearAt(秒)驱动
  void frame;

  // 节点入场时刻(秒)
  const tStart = 1.0;
  const tModel = 1.5;
  const tTools = 2.0;
  const tEnd = 2.4;

  // token 跑一圈的时刻(秒)
  const flow = {
    toModel: 3.4, // START -> model
    toTools: 4.1, // model -> tools
    back: 4.9, // tools -> model(回流)
    toEnd: 5.8, // model -> END
  };

  return (
    <GraphScene
      bg={C.bg}
      scenario="自循环智能体"
      arrowColors={[PATTERN_COLORS.loop, C.gold, '#4a453e']}
      svgChildren={
        <>
          {/* START -> model */}
          <GraphEdge
            from={{x: N.start.x + 100, y: N.start.y}}
            to={{x: N.model.x - 100, y: N.model.y}}
            color="#4a453e"
            appearAt={tStart + 0.2}
            drawDur={0.4}
          />
          {/* model -> tools (tool_calls) */}
          <GraphEdge
            from={{x: N.model.x + 100, y: N.model.y}}
            to={{x: N.tools.x - 100, y: N.tools.y}}
            color={PATTERN_COLORS.loop}
            appearAt={tModel + 0.3}
            drawDur={0.4}
          />
          {/* tools -> model 回流 (loop 弧, result) */}
          <GraphEdge
            from={{x: N.tools.x, y: N.tools.y - 44}}
            to={{x: N.model.x, y: N.model.y - 44}}
            type="loop"
            loopLift={100}
            color={C.gold}
            appearAt={tTools + 0.3}
            drawDur={0.5}
          />
          {/* model -> END (stop) */}
          <GraphEdge
            from={{x: N.model.x, y: N.model.y + 44}}
            to={{x: N.end.x, y: N.end.y - 44}}
            direction="vertical"
            color="#4a453e"
            appearAt={tEnd + 0.2}
            drawDur={0.4}
          />

          {/* token 跑一圈 */}
          <TokenFlow
            from={{x: N.start.x + 100, y: N.start.y}}
            to={{x: N.model.x - 100, y: N.model.y}}
            color={PATTERN_COLORS.loop}
            appearAt={flow.toModel}
            flowDur={0.6}
          />
          <TokenFlow
            from={{x: N.model.x + 100, y: N.model.y}}
            to={{x: N.tools.x - 100, y: N.tools.y}}
            color={PATTERN_COLORS.loop}
            appearAt={flow.toTools}
            flowDur={0.6}
          />
          <TokenFlow
            from={{x: N.tools.x, y: N.tools.y - 44}}
            to={{x: N.model.x, y: N.model.y - 44}}
            type="loop"
            loopLift={100}
            color={C.gold}
            appearAt={flow.back}
            flowDur={0.7}
          />
          <TokenFlow
            from={{x: N.model.x, y: N.model.y + 44}}
            to={{x: N.end.x, y: N.end.y - 44}}
            direction="vertical"
            color={PATTERN_COLORS.loop}
            appearAt={flow.toEnd}
            flowDur={0.6}
          />
        </>
      }
    >
      {/* HTML 图层:标题 + 节点 */}
      <PatternTitle
        kicker="PATTERN · 05 / 06"
        title="Agent Loop"
        subtitle="自循环智能体"
        accentColor={PATTERN_COLORS.loop}
        appearAt={0}
        x={200}
        y={120}
      />

      <GraphNode
        x={N.start.x}
        y={N.start.y}
        label="START"
        color={C.textMuted}
        appearAt={tStart}
      />
      <GraphNode
        x={N.model.x}
        y={N.model.y}
        label="model"
        sub="LLM"
        color={PATTERN_COLORS.loop}
        appearAt={tModel}
        shape="special"
      />
      <GraphNode
        x={N.tools.x}
        y={N.tools.y}
        label="tools"
        sub="TOOL"
        color={C.gold}
        appearAt={tTools}
      />
      <GraphNode
        x={N.end.x}
        y={N.end.y}
        label="END"
        color={C.textMuted}
        appearAt={tEnd}
      />
    </GraphScene>
  );
};
