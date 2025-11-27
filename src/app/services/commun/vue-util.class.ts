export class VueUtil {
  static iconeVariation(variation: number): string {
    if (variation == 0) {
      return 'pi-arrow-circle-right';
    } else if (variation > 0) {
      return 'pi-arrow-circle-up';
    } else {
      return 'pi-arrow-circle-down';
    }
  }
}

