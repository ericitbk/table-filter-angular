import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { CloseMenu, OpenMenu } from './sidebar.actions';
import { SidebarStateModel } from '../../../shared/models';

@State<SidebarStateModel>({
  name: 'sidebar',
  defaults: {
    isSidebarOpen: false
  },
})
@Injectable()
export class SidebarState {
  @Selector()
  static isSidebarOpen(state: SidebarStateModel): boolean {
    return state.isSidebarOpen;
  }

  @Action(OpenMenu)
  openMenu({ patchState }: StateContext<SidebarStateModel>) {
    patchState({
      isSidebarOpen: true,
    });
  }

  @Action(CloseMenu)
  closeMenu({ patchState }: StateContext<SidebarStateModel>) {
    patchState({
      isSidebarOpen: false,
    });
  }
}
