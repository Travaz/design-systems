import type * as React from 'react';
export type IconName = 'circle-info' | 'circle-check' | 'triangle-alert' | 'octagon-x' | 'hexagon' | 'hexagon-plus' | 'arrow-right' | 'plus' | 'search' | 'download';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'; size?: 'sm' | 'md' | 'lg'; iconStart?: IconName; iconEnd?: IconName; loading?: boolean; href?: string }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface BadgeProps { tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'; icon?: boolean; children?: React.ReactNode; className?: string }
export declare function Badge(props: BadgeProps): React.ReactElement;
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; multiline?: boolean }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label: React.ReactNode; hint?: React.ReactNode }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export interface SwitchProps { label: React.ReactNode; checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean; id?: string; className?: string }
export declare function Switch(props: SwitchProps): React.ReactElement;
export interface AlertProps { tone?: 'info' | 'success' | 'warning' | 'danger'; title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; className?: string }
export declare function Alert(props: AlertProps): React.ReactElement;
export interface CardProps { title?: React.ReactNode; eyebrow?: React.ReactNode; children?: React.ReactNode; footer?: React.ReactNode; href?: string; as?: string; titleAs?: 'h2' | 'h3' | 'h4'; className?: string }
export declare function Card(props: CardProps): React.ReactElement;
export interface TabItem { id: string; label: React.ReactNode; content?: React.ReactNode }
export interface TabsProps { items: TabItem[]; label: string; value?: string; defaultValue?: string; onChange?: (id: string) => void; id?: string; className?: string }
export declare function Tabs(props: TabsProps): React.ReactElement;
export interface DataTableColumn<R = any> { key: string; label: React.ReactNode; numeric?: boolean; nowrap?: boolean; render?: (value: any, row: R) => React.ReactNode }
export interface DataTableProps<R = any> { columns: DataTableColumn<R>[]; rows: R[]; caption?: string; density?: 'comfortable' | 'compact'; scrollable?: boolean; className?: string }
export declare function DataTable(props: DataTableProps): React.ReactElement;
export interface EmptyStateProps { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; icon?: IconName; titleAs?: 'h2' | 'h3' | 'h4'; className?: string }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;
export interface EnvironmentBannerProps { env?: 'development' | 'staging' | 'preview'; label?: string; className?: string }
export declare function EnvironmentBanner(props: EnvironmentBannerProps): React.ReactElement;
export interface IconProps { name: IconName; size?: 16 | 24 | 32 | number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
declare global { interface Window { Apis: { Button: typeof Button; Badge: typeof Badge; TextField: typeof TextField; Checkbox: typeof Checkbox; Switch: typeof Switch; Alert: typeof Alert; Card: typeof Card; Tabs: typeof Tabs; DataTable: typeof DataTable; EmptyState: typeof EmptyState; EnvironmentBanner: typeof EnvironmentBanner; Icon: typeof Icon } } }
