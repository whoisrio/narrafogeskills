import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, SIZE} from './theme';

// Table 表格:暗金风数据表。表头金底深字,数据行半透 bgCard,逐行 spring 上滑入场。
// highlightRow 用金色 tint 突出某行。表示参数对比 / 配置项 / 结构化数据。
export const Table: React.FC<{
  x: number;
  y: number;
  headers: string[];
  rows: string[][];
  colWidths?: number[];
  rowHeight?: number;
  delay?: number; // 帧
  highlightRow?: number; // 数据行索引(0-based),-1 不高亮
}> = ({
  x,
  y,
  headers,
  rows,
  colWidths,
  rowHeight = 56,
  delay = 0,
  highlightRow = -1,
}) => {
  const frame = useCurrentFrame();
  const cols = headers.length;
  const cw = colWidths ?? Array(cols).fill(200);
  const totalW = cw.reduce((s, w) => s + w, 0);

  const colX: number[] = [0];
  for (let i = 0; i < cols - 1; i++) colX.push(colX[i] + cw[i]);

  const renderRow = (cells: string[], ri: number, isHeader: boolean) => {
    const rowDelay = delay + ri * 8;
    const op = interpolate(frame, [rowDelay, rowDelay + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    const dy = interpolate(frame, [rowDelay, rowDelay + 10], [14, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (op <= 0.01) return null;
    const isHl = !isHeader && ri - 1 === highlightRow;
    return (
      <div
        key={ri}
        style={{
          display: 'flex',
          opacity: op,
          transform: `translateY(${dy}px)`,
          height: rowHeight,
        }}
      >
        {cells.map((cell, c) => (
          <div
            key={c}
            style={{
              width: cw[c],
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isHeader ? C.gold : isHl ? `${C.gold}18` : C.bgCard,
              color: isHeader ? '#0f0f0f' : C.text,
              fontFamily: isHeader ? FONT.mono : FONT.body,
              fontSize: isHeader ? SIZE.caption : SIZE.bodySm,
              fontWeight: isHeader ? 700 : 500,
              borderRight: c < cols - 1 ? `1px solid ${C.border}` : 'none',
              letterSpacing: isHeader ? 1 : 0,
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: totalW,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.4)',
      }}
    >
      {renderRow(headers, 0, true)}
      {rows.map((r, ri) => renderRow(r, ri + 1, false))}
    </div>
  );
};
