import { MapSpaceType } from 'enums'
import { PlacedLineType } from 'enums/PlacedLineType'
import { type GameBuilder, context, BuildTrackPhase } from 'game'
import { type MapSpace, Line, CityTile } from 'objects'

export function determineNewLineOwner (line: Line, mapSpace: MapSpace, rotation: number, b: GameBuilder): void {
  const { p } = context()
  if (p === null) throw new Error('user is not in the game')
  if (!p.hasTurn) throw new Error('user is not turn player')

  const externalLinkedObject = mapSpace.getLinkedObject(line.getDirection(rotation))

  const placedLine = line.determinePlacedLineType(mapSpace, rotation)

  if (placedLine.type === PlacedLineType.NEW_LINE) {
    b.setLineOwner(line, p)

    if (externalLinkedObject instanceof Line && externalLinkedObject.owner === null) {
      b.setLineOwner(externalLinkedObject, p)
      externalLinkedObject.internalLinkedLines.forEach(_ => b.setLineOwner(_, p))
    }

    const phase = b.game.phase as BuildTrackPhase
    b.setPhase(new BuildTrackPhase(
      phase.buildingTrackTileIds,
      phase.buildingCityTileIds,
      [...phase.newLines, line])
    )

    return
  }

  if (placedLine.type === PlacedLineType.REPLACE_LINE) {
    if (placedLine.srcLine.owner !== null) {
      b.setLineOwner(line, placedLine.srcLine.owner)
    } else {
      if (mapSpace.type !== MapSpaceType.TOWN) {
        // 反対の線路が方向転換して線路か都市に接続している場合がある
        const pairLine = line.pairLine
        if (pairLine !== null) {
          const pairLinePlacedLine = pairLine.determinePlacedLineType(mapSpace, rotation)
          if (pairLinePlacedLine.type === PlacedLineType.REDIRECT_LINE) {
            const pairLineExternalLinkedObject = mapSpace.getLinkedObject(pairLine.getDirection(rotation))
            if (pairLineExternalLinkedObject instanceof Line || pairLineExternalLinkedObject instanceof CityTile) {
              b.setLineOwner(line, p)
              const externalLinkedObject = mapSpace.getLinkedObject(line.getDirection(rotation))
              if (externalLinkedObject instanceof Line) {
                b.setLineOwner(externalLinkedObject, p)
                externalLinkedObject.internalLinkedLines.forEach(_ => b.setLineOwner(_, p))
              }
            }
          }
        }
      }
    }
    return
  }

  if (placedLine.type === PlacedLineType.REDIRECT_LINE) {
    if (placedLine.srcLine.owner !== null) {
      if (placedLine.srcLine.owner.id !== p.id) throw new Error('Cannot redirect other player\'s line')

      b.setLineOwner(line, p)

      if (externalLinkedObject instanceof Line && externalLinkedObject.owner === null) {
        b.setLineOwner(externalLinkedObject, p)
        externalLinkedObject.internalLinkedLines.forEach(_ => b.setLineOwner(_, p))
      }
    } else {
      if (externalLinkedObject instanceof Line || externalLinkedObject instanceof CityTile) {
        b.setLineOwner(line, p)
        if (externalLinkedObject instanceof Line && externalLinkedObject.owner === null) {
          b.setLineOwner(externalLinkedObject, p)
          externalLinkedObject.internalLinkedLines.forEach(_ => b.setLineOwner(_, p))
        }
      }
    }
    return
  }

  throw new Error('Unknown placed line type')
}
