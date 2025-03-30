import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationChart } from 'primeng/organizationchart';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, OrganizationChart],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent implements OnInit {
  data: TreeNode[] = [
    {
      label: 'Frontend Development',
      expanded: true,
      data: 'ar',
      children: [
        {
          label: 'Argentina',
          expanded: true,
          data: 'ar',
          children: [
            {
              label: 'Argentina',
              data: 'ar'
            },
            {
              label: 'Croatia',
              data: 'hr'
            }
          ]
        },
        {
          label: 'France',
          expanded: true,
          data: 'fr',
          children: [
            {
              label: 'France',
              data: 'fr'
            },
            {
              label: 'Morocco',
              data: 'ma'
            }
          ]
        }
      ]
    }
  ];
  constructor(private viewportScroller: ViewportScroller) { }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
}
