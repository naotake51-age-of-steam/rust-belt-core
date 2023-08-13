import { PhaseId } from 'enums'
import { type Phase } from './Phase'

export class ProductionPhase implements Phase {
  public readonly id = PhaseId.PRODUCTION

  constructor (
    public readonly goodsCubeIds: number[] | null, // 商品が残っていない可能性があるので[number, number]とはしない
    public readonly selectedCubeId: number | null
  ) {}

  public deepCopy (): ProductionPhase {
    return new ProductionPhase(
      (this.goodsCubeIds !== null) ? [...this.goodsCubeIds] : null,
      this.selectedCubeId
    )
  }

  public static prepare (): ProductionPhase {
    throw new Error('Not implemented')
  }

  public get message (): string {
    throw new Error('Not implemented')
  }

  public actionProduceGoodsCubes (): boolean {
    throw new Error('Not implemented')
  }

  public actionSelectGoodsCube (goodsCubeId: number): boolean {
    throw new Error('Not implemented')
  }

  public canPlaceToGoodsDisplaySpace (goodsDisplaySpaceId: number): boolean {
    // 商品を引いた場合は２つとも配置しなければならない。（だいちさん談）
    throw new Error('Not implemented')
  }

  public actionPlaceToGoodsDisplaySpace (goodsDisplaySpaceId: number): boolean {
    throw new Error('Not implemented')
  }

  public canPassProduction (): boolean {
    // 商品を引いたらもうパスはできない。
    throw new Error('Not implemented')
  }

  public actionPassProduction (): boolean {
    throw new Error('Not implemented')
  }
}
