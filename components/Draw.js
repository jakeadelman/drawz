import React from "react";
import { LinePath } from "@vx/shape";
import { localPoint } from "@vx/event";
import { Drag } from "@vx/drag";
import { curveBasis } from "@vx/curve";
import { LinearGradient } from "@vx/gradient";
import { Nav, NavItem, NavLink } from "reactstrap";

export default class DragII extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.clear = this.clear.bind(this);
    this.undo = this.undo.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  componentDidUpdate() {
    console.log(this.state.data);
  }
  clear() {
    this.setState({ data: [] });
  }
  undo() {
    console.log(this.state.data.length);
    this.setState({
      data: this.state.data.slice(0, this.state.data.length - 1)
    });
  }

  render() {
    let width = this.state.width - this.state.height * 0.1;
    let height = this.state.height - this.state.height * 0.1;
    return (
      <div>
        <div style={{ display: "flex" }}>
          <Nav style={{ marginRight: "auto", marginLeft: 0 }}>
            <NavItem>
              <NavLink>
                <p style={{ color: "#d95d39" }}>drawz</p>
              </NavLink>
            </NavItem>
          </Nav>
          <div style={{ display: "flex" }}>
            <Nav style={{ marginRight: 0, marginLeft: "auto" }}>
              <NavItem>
                <NavLink href="#" onClick={this.undo}>
                  undo
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink href="#" onClick={this.clear}>
                  clear
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <style jsx global>
            {`
              a {
                color: #d95d39;
              }
              a:hover {
                color: #7b9e89;
              }
            `}
          </style>
        </div>
        <div
          className="outer"
          style={{ width: "100vw", display: "inline-flex" }}
        >
          <div
            className="DragII"
            style={{
              display: "inline-flex",
              touchAction: "none",
              margin: "auto"
            }}
          >
            <svg width={width} height={height} className="svg-inn">
              <LinearGradient id="stroke" from="#ff614e" to="#ffdc64" />
              <rect fill="#04002b" width={width} height={height} rx={14} />
              {this.state.data.map((d, i) => {
                return (
                  <LinePath
                    key={`line-${i}`}
                    fill={"transparent"}
                    stroke="url(#stroke)"
                    strokeWidth={3}
                    data={d}
                    curve={curveBasis}
                    x={d => d.x}
                    y={d => d.y}
                    xScale={d => d}
                    yScale={d => d}
                  />
                );
              })}
              <Drag
                width={width}
                height={height}
                resetOnStart={true}
                onDragStart={({ x, y }) => {
                  // add the new line with the starting point
                  this.setState((state, props) => {
                    const newLine = [{ x, y }];
                    return {
                      data: state.data.concat([newLine])
                    };
                  });
                }}
                onDragMove={({ x, y, dx, dy }) => {
                  // add the new point to the current line
                  this.setState((state, props) => {
                    const nextData = [...state.data];
                    const point = [{ x: x + dx, y: y + dy }];
                    const i = nextData.length - 1;
                    nextData[i] = nextData[i].concat(point);
                    return { data: nextData };
                  });
                }}
              >
                {({
                  x,
                  y,
                  dx,
                  dy,
                  isDragging,
                  dragStart,
                  dragEnd,
                  dragMove
                }) => {
                  return (
                    <g>
                      {/* decorate the currently drawing line */}
                      {isDragging && (
                        <g>
                          <rect
                            fill="white"
                            width={8}
                            height={8}
                            x={x + dx - 4}
                            y={y + dy - 4}
                            style={{ pointerEvents: "none" }}
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={4}
                            fill="transparent"
                            stroke="white"
                            style={{ pointerEvents: "none" }}
                          />
                        </g>
                      )}
                      {/* create the drawing area */}
                      <rect
                        fill="transparent"
                        width={width}
                        height={height}
                        onMouseDown={dragStart}
                        onMouseUp={dragEnd}
                        onMouseMove={dragMove}
                        onTouchStart={dragStart}
                        onTouchEnd={dragEnd}
                        onTouchMove={dragMove}
                      />
                    </g>
                  );
                }}
              </Drag>
              <style jsx>
                {`
                  .svg-inn {
                    margin: auto;
                    max-width: 100%;
                  }
                `}
              </style>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
