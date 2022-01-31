import React, { ReactElement, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { Icon, useTheme2 } from '@grafana/ui';
import { GrafanaTheme2, NavMenuItemType, NavModelItem } from '@grafana/data';
import { useMenuItem } from '@react-aria/menu';
import { useFocus, useKeyboard } from '@react-aria/interactions';
import { TreeState } from '@react-stately/tree';
import { mergeProps } from '@react-aria/utils';
import { Node } from '@react-types/shared';

import { useNavBarItemMenuContext } from './context';
import { NestedSubMenu } from './NestedSubMenu';

export interface NavBarItemMenuItemProps {
  item: Node<NavModelItem>;
  state: TreeState<NavModelItem>;
  onNavigate: (item: NavModelItem) => void;
}

export function NavBarItemMenuItem({ item, state, onNavigate }: NavBarItemMenuItemProps): ReactElement {
  const { onClose, onLeft } = useNavBarItemMenuContext();
  const { key, rendered } = item;
  const ref = useRef<HTMLLIElement>(null);
  const isDisabled = state.disabledKeys.has(key);

  // style to the focused menu item
  const [isFocused, setFocused] = useState(false);
  const { focusProps } = useFocus({ onFocusChange: setFocused, isDisabled });
  const theme = useTheme2();
  const isSection = item.value.menuItemType === 'section';
  const isDivider = !!item.value.divider;
  const styles = getStyles(theme, isFocused, isSection, isDivider);
  const onAction = () => {
    onNavigate(item.value);
    onClose();
  };

  let { menuItemProps } = useMenuItem(
    {
      isDisabled,
      'aria-label': item['aria-label'],
      key,
      closeOnSelect: true,
      onClose,
      onAction,
    },
    state,
    ref
  );

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'ArrowLeft') {
        onLeft();
      }
      e.continuePropagation();
    },
  });

  return (
    <li {...mergeProps(menuItemProps, focusProps, keyboardProps)} ref={ref} className={styles.menuItem}>
      {rendered}
      {!!item.value.children?.length && item.value.menuItemType === NavMenuItemType.Item && (
        <>
          <span style={{ marginLeft: 'auto' }}>{<Icon name={'angle-right'} />}</span>
          <NestedSubMenu items={item.value.children} />
        </>
      )}
    </li>
  );
}

function getStyles(theme: GrafanaTheme2, isFocused: boolean, isSection: boolean, isDivider: boolean) {
  return {
    menuItem: css`
      position: relative;
      color: ${theme.colors.text.primary};
      display: flex;
      align-items: center;

      &:hover {
        background-color: ${isDivider ? 'transparent' : theme.colors.action.hover};
      }

      &:focus-visible {
        background-color: ${theme.colors.action.hover};
        box-shadow: none;
        color: ${theme.colors.text.primary};
        outline: 2px solid ${theme.colors.primary.main};
        outline-offset: -2px;
        transition: none;
      }

      &:hover {
        & > ul {
          opacity: 1;
          visibility: visible;
        }
      }
    `,
  };
}