import React from 'react';
import {Composition, Folder} from 'remotion';
import {Gallery} from './demo/doodle/Gallery';
import {GridBackgroundDemo, DoodleCardDemo} from './demo/doodle/backgrounds';
import {PillBadgeDemo, StepBadgeDemo} from './demo/doodle/badges';
import {
  LinkedBlocksDemo,
  DatabaseCylinderDemo,
  CircleNodeDemo,
} from './demo/doodle/nodes';
import {DashedArrowDemo, SplitDividerDemo} from './demo/doodle/connectors';
import {BigTitleDemo} from './demo/doodle/text';
import {StickerImageDemo} from './demo/doodle/media';
import {WrenchGearDemo} from './demo/doodle/tools';
import {CodeCardDemo, CodeCardDarkDemo} from './demo/doodle/code';
import {
  VectorSearch,
  VECTOR_SEARCH_DURATION,
} from './examples/doodle/vector-search/VectorSearch';
import {AgentLoop} from './examples/doodle/agent-loop/AgentLoop';
import {CodeWalk} from './examples/doodle/code-walk/CodeWalk';
import {
  BreathingPause,
  BREATHING_PAUSE_DURATION,
} from './examples/doodle/patterns/BreathingPause';
import {
  InfoHierarchy,
  INFO_HIERARCHY_DURATION,
} from './examples/doodle/patterns/InfoHierarchy';
import {
  StructuralEntry,
  STRUCTURAL_ENTRY_DURATION,
} from './examples/doodle/patterns/StructuralEntry';
import {
  AnthropomorphicPrompt,
  ANTHROPOMORPHIC_PROMPT_DURATION,
} from './examples/doodle/patterns/AnthropomorphicPrompt';
import {
  ColorCoding,
  COLOR_CODING_DURATION,
} from './examples/doodle/patterns/ColorCoding';
import {TrainingCost, TRAINING_COST_DURATION} from './examples/dark-botanical/training-cost/TrainingCost';
import {QuantizeCode, QUANTIZE_CODE_DURATION} from './examples/dark-botanical/quantize-code/QuantizeCode';
import {AgentLoop as MTAgentLoop, AGENT_LOOP_DURATION} from './examples/modern-tech/agent-loop/AgentLoop';
import {CodeDeepRead, CODE_DEEP_READ_DURATION} from './examples/modern-tech/code-deep-read/CodeDeepRead';
import {DarkBotanicalDemo} from './demo/dark-botanical/overview';
import {DBChartsDemo} from './demo/dark-botanical/charts';
import {DBCodeCaptionDemo} from './demo/dark-botanical/code-caption';
import {
  DBFlowNodeDemo,
  DBFlowArrowDemo,
  DBContainerDemo,
  DBTableDemo,
  DBMatrixDemo,
  DBVectorDemo,
  DBTokenSequenceDemo,
  DBChatBubbleDemo,
  DBFormulaDemo,
  DBMagnifierDemo,
  DBParticleAssemblyDemo,
} from './demo/dark-botanical/ml';
import {
  MatrixDemo,
  VectorDemo,
  TokenSequenceDemo,
  FormulaDemo,
  ChatBubbleDemo,
  ParticleAssemblyDemo,
  ContainerDemo,
  TableDemo,
} from './demo/doodle/ml';
import {Attention, ATTENTION_DURATION} from './examples/doodle/attention/Attention';
import {
  AttentionCalc,
  ATTENTION_CALC_DURATION,
} from './examples/dark-botanical/attention-calc/AttentionCalc';

const DEMO_FRAMES = 120;
const SIZE = {width: 1920, height: 1080, fps: 30} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="components">
        <Folder name="doodle">
          <Composition
            id="Gallery"
            component={Gallery}
            durationInFrames={90}
            {...SIZE}
          />
          <Composition
            id="GridBackground"
            component={GridBackgroundDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="PillBadge"
            component={PillBadgeDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="DoodleCard"
            component={DoodleCardDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="DashedArrow"
            component={DashedArrowDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="DatabaseCylinder"
            component={DatabaseCylinderDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="LinkedBlocks"
            component={LinkedBlocksDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="CircleNode"
            component={CircleNodeDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="BigTitle"
            component={BigTitleDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="SplitDivider"
            component={SplitDividerDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="StepBadge"
            component={StepBadgeDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="StickerImage"
            component={StickerImageDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="WrenchGear"
            component={WrenchGearDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="CodeCard"
            component={CodeCardDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition
            id="CodeCardDark"
            component={CodeCardDarkDemo}
            durationInFrames={DEMO_FRAMES}
            {...SIZE}
          />
          <Composition id="DoodleMatrix" component={MatrixDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleVector" component={VectorDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleTokenSequence" component={TokenSequenceDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleFormula" component={FormulaDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleChatBubble" component={ChatBubbleDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleParticleAssembly" component={ParticleAssemblyDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleContainer" component={ContainerDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DoodleTable" component={TableDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
        </Folder>
        <Folder name="dark-botanical">
          <Composition
            id="DarkBotanical"
            component={DarkBotanicalDemo}
            durationInFrames={120}
            {...SIZE}
          />
          <Composition
            id="DarkBotanicalCharts"
            component={DBChartsDemo}
            durationInFrames={120}
            {...SIZE}
          />
          <Composition
            id="DarkBotanicalCodeCaption"
            component={DBCodeCaptionDemo}
            durationInFrames={120}
            {...SIZE}
          />
          <Composition id="DarkBotanicalFlowNode" component={DBFlowNodeDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalFlowArrow" component={DBFlowArrowDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalContainer" component={DBContainerDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalTable" component={DBTableDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalMatrix" component={DBMatrixDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalVector" component={DBVectorDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalTokenSequence" component={DBTokenSequenceDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalChatBubble" component={DBChatBubbleDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalFormula" component={DBFormulaDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalMagnifier" component={DBMagnifierDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
          <Composition id="DarkBotanicalParticleAssembly" component={DBParticleAssemblyDemo} durationInFrames={DEMO_FRAMES} {...SIZE} />
        </Folder>
      </Folder>
      <Folder name="examples">
        <Folder name="doodle">
          <Composition
            id="VectorSearch"
            component={VectorSearch}
            durationInFrames={VECTOR_SEARCH_DURATION}
            {...SIZE}
          />
          <Composition
            id="AgentLoop"
            component={AgentLoop}
            durationInFrames={150}
            {...SIZE}
          />
          <Composition
            id="CodeWalk"
            component={CodeWalk}
            durationInFrames={150}
            {...SIZE}
          />
          <Composition
            id="DoodleAttention"
            component={Attention}
            durationInFrames={ATTENTION_DURATION}
            {...SIZE}
          />
          <Composition
            id="PatternBreathingPause"
            component={BreathingPause}
            durationInFrames={BREATHING_PAUSE_DURATION}
            {...SIZE}
          />
          <Composition
            id="PatternInfoHierarchy"
            component={InfoHierarchy}
            durationInFrames={INFO_HIERARCHY_DURATION}
            {...SIZE}
          />
          <Composition
            id="PatternStructuralEntry"
            component={StructuralEntry}
            durationInFrames={STRUCTURAL_ENTRY_DURATION}
            {...SIZE}
          />
          <Composition
            id="PatternAnthropomorphicPrompt"
            component={AnthropomorphicPrompt}
            durationInFrames={ANTHROPOMORPHIC_PROMPT_DURATION}
            {...SIZE}
          />
          <Composition
            id="PatternColorCoding"
            component={ColorCoding}
            durationInFrames={COLOR_CODING_DURATION}
            {...SIZE}
          />
        </Folder>
        <Folder name="dark-botanical">
          <Composition
            id="DarkBotanicalTrainingCost"
            component={TrainingCost}
            durationInFrames={TRAINING_COST_DURATION}
            {...SIZE}
          />
          <Composition
            id="DarkBotanicalQuantizeCode"
            component={QuantizeCode}
            durationInFrames={QUANTIZE_CODE_DURATION}
            {...SIZE}
          />
          <Composition
            id="DarkBotanicalAttentionCalc"
            component={AttentionCalc}
            durationInFrames={ATTENTION_CALC_DURATION}
            {...SIZE}
          />
        </Folder>
        <Folder name="modern-tech">
          <Composition
            id="ModernTechAgentLoop"
            component={MTAgentLoop}
            durationInFrames={AGENT_LOOP_DURATION}
            {...SIZE}
          />
          <Composition
            id="ModernTechCodeDeepRead"
            component={CodeDeepRead}
            durationInFrames={CODE_DEEP_READ_DURATION}
            {...SIZE}
          />
        </Folder>
      </Folder>
    </>
  );
};
